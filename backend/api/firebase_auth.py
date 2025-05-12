import os
import firebase_admin
from firebase_admin import auth, credentials
from django.contrib.auth.models import User
from rest_framework import authentication, exceptions

# Initialize Firebase only once
cred = credentials.Certificate(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))
firebase_admin.initialize_app(cred)

class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        id_token = request.headers.get('Authorization')
        if not id_token:
            return None  # No token provided

        try:
            decoded_token = auth.verify_id_token(id_token)
        except Exception:
            raise exceptions.AuthenticationFailed('Invalid Firebase token')

        uid = decoded_token['uid']
        email = decoded_token.get('email')

        # Link Firebase user to Django user
        user, _ = User.objects.get_or_create(username=uid, defaults={'email': email})
        return (user, None)
