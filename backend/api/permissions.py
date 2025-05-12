from rest_framework.permissions import BasePermission
from firebase_admin import auth as firebase_auth
from rest_framework.exceptions import AuthenticationFailed
from .models import FirebaseUser
from django.contrib.auth.models import User

class IsFirebaseAuthenticated(BasePermission):
    def has_permission(self, request, view):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return False

        token = auth_header.split(" ")[1]

        try:
            decoded_token = firebase_auth.verify_id_token(token)
            firebase_uid = decoded_token["uid"]
            email = decoded_token.get("email", firebase_uid)
        except Exception:
            return False

        firebase_user, _ = FirebaseUser.objects.get_or_create(
            firebase_user_id=firebase_uid,
            defaults={"user": User.objects.create(username=email, email=email)}
        )
        request.firebase_user = firebase_user
        return True
