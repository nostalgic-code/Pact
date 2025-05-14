from django.shortcuts import render
from rest_framework import viewsets
from .models import Pact, DailyCheckIn, PactStatusHistory
from .serializers import PactSerializer, DailyCheckInSerializer, PactStatusHistorySerializer
from django.contrib.auth.models import User

# Create your views here.

# In any views.py
from django.http import JsonResponse

def test_cors(request):
    return JsonResponse({"message": "CORS is working!"})

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from firebase_admin import auth as firebase_auth
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from firebase_admin import auth as firebase_auth

from .models import Pact, FirebaseUser, DailyCheckIn
from .serializers import PactSerializer, DailyCheckInSerializer


class PactViewSet(viewsets.ModelViewSet):
    queryset = Pact.objects.none()  # Needed for DRF router registration
    serializer_class = PactSerializer

    def get_queryset(self):
        request = self.request
        id_token = request.headers.get("Authorization")
        if not id_token:
            raise AuthenticationFailed("Missing Firebase ID token")

        if id_token.startswith("Bearer "):
            id_token = id_token.split(" ")[1]

        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            firebase_uid = decoded_token['uid']
        except Exception as e:
            raise AuthenticationFailed(f"Invalid Firebase ID token: {str(e)}")

        try:
            firebase_user = FirebaseUser.objects.get(firebase_user_id=firebase_uid)
        except FirebaseUser.DoesNotExist:
            raise AuthenticationFailed("Firebase user not found")

        queryset = Pact.objects.filter(firebase_user=firebase_user)

        # 🔁 Update each pact's status
        for pact in queryset:
            total_checkins = DailyCheckIn.objects.filter(pact=pact).count()
            updated = False

            if pact.current_day != total_checkins:
                pact.current_day = total_checkins
                updated = True

            if total_checkins >= pact.duration_days:
                if not pact.is_completed or pact.is_active:
                    pact.is_completed = True
                    pact.is_active = False
                    updated = True
            else:
                if not pact.is_active or pact.is_completed:
                    pact.is_active = True
                    pact.is_completed = False
                    updated = True

            if updated:
                pact.save(update_fields=["current_day", "is_completed", "is_active"])

        return queryset

    def create(self, request, *args, **kwargs):
        # Extract and verify Firebase ID token
        id_token = request.headers.get('Authorization')
        if not id_token:
            raise AuthenticationFailed("Missing Firebase ID token")

        if id_token.startswith("Bearer "):
            id_token = id_token.split(" ")[1]

        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            firebase_uid = decoded_token['uid']
        except Exception as e:
            raise AuthenticationFailed(f"Invalid Firebase ID token: {str(e)}")

        # Get or create FirebaseUser
        firebase_user, _ = FirebaseUser.objects.get_or_create(
            firebase_user_id=firebase_uid,
            defaults={"user": User.objects.get_or_create(username=firebase_uid)[0]}
        )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Set the firebase_user before saving
        pact = serializer.save(firebase_user=firebase_user)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['get'])
    def checkins(self, request, pk=None):
        pact = self.get_object()
        checkins = pact.checkins.order_by('-date')
        serializer = DailyCheckInSerializer(checkins, many=True)
        return Response(serializer.data)




from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import FirebaseUser
import firebase_admin
from firebase_admin import auth as firebase_auth
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import exception_handler

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from firebase_admin import auth as firebase_auth

from .models import DailyCheckIn, FirebaseUser, Pact
from .serializers import DailyCheckInSerializer
from django.contrib.auth.models import User

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from firebase_admin import auth as firebase_auth

from .models import DailyCheckIn, FirebaseUser, PactStatusHistory
from .serializers import DailyCheckInSerializer
from django.contrib.auth.models import User

from django.utils.timezone import make_aware
from datetime import datetime
from django.db.models import Q

@method_decorator(csrf_exempt, name='dispatch')
class DailyCheckInViewSet(viewsets.ModelViewSet):
    queryset = DailyCheckIn.objects.none() 
    serializer_class = DailyCheckInSerializer

    def get_queryset(self):
        id_token = self.request.headers.get('Authorization')
        if not id_token:
            raise AuthenticationFailed("Missing Firebase ID token")

        if id_token.startswith("Bearer "):
            id_token = id_token.split(" ")[1]

        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            firebase_uid = decoded_token['uid']
        except Exception as e:
            raise AuthenticationFailed(f"Invalid Firebase ID token: {str(e)}")

        # ✅ Ensure FirebaseUser exists
        firebase_user, _ = FirebaseUser.objects.get_or_create(
            firebase_user_id=firebase_uid,
            defaults={"user": User.objects.get_or_create(username=firebase_uid)[0]}
        )

        queryset = DailyCheckIn.objects.filter(pact__firebase_user=firebase_user)

        # Add date range filtering
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        if start_date and end_date:
            try:
                start = datetime.strptime(start_date, '%Y-%m-%d').date()
                end = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__range=(start, end))
            except ValueError:
                pass  # Invalid date format, return all results

        return queryset.order_by('-date')


    def create(self, request, *args, **kwargs):
        print("🧪 RAW BODY:", request.body)
        print("🧪 PARSED DATA:", request.data)

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("🔥 Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Extract and verify Firebase ID token
        id_token = request.headers.get('Authorization')
        if not id_token:
            raise AuthenticationFailed("Missing Firebase ID token")

        if id_token.startswith("Bearer "):
            id_token = id_token.split(" ")[1]

        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            firebase_uid = decoded_token['uid']
            email = decoded_token.get('email', f"{firebase_uid}@firebase.local")
            print("🧪 decoded Firebase UID:", firebase_uid)
        except Exception as e:
            raise AuthenticationFailed(f"Invalid Firebase ID token: {str(e)}")

        # Get or create FirebaseUser
        firebase_user, created = FirebaseUser.objects.get_or_create(
            firebase_user_id=firebase_uid,
            defaults={"user": User.objects.get_or_create(username=firebase_uid)[0]}
        )

        pact = serializer.validated_data['pact']

        print("🔥 firebase_user from token:", firebase_user.id)
        print("🔥 firebase_user on pact:", pact.firebase_user.id if pact.firebase_user else None)

        if pact.firebase_user != firebase_user:
            raise AuthenticationFailed("You do not own this pact.")

        # Save the check-in
        checkin = serializer.save()

        # 🔁 Recalculate and update pact status
        total_checkins = DailyCheckIn.objects.filter(pact=pact).count()
        pact.current_day = total_checkins
        print(f"📊 Total check-ins: {total_checkins} / {pact.duration_days}")

        if total_checkins >= pact.duration_days:
            pact.is_completed = True
            pact.is_active = False
            print("✅ Pact marked as completed.")

            # ✅ Log this in status history
            PactStatusHistory.objects.create(
                pact=pact,
                status="completed"
            )
        else:
            pact.is_active = True
            pact.is_completed = False

        pact.save(update_fields=["is_completed", "is_active", "current_day"])
        print(f"🔄 Pact saved: active={pact.is_active}, completed={pact.is_completed}, current_day={pact.current_day}")

        return Response(self.get_serializer(checkin).data, status=status.HTTP_201_CREATED)



class PactStatusHistoryViewSet(viewsets.ModelViewSet):
    queryset = PactStatusHistory.objects.none()
    serializer_class = PactStatusHistorySerializer

    def get_queryset(self):
        id_token = self.request.headers.get('Authorization')
        if not id_token:
            raise AuthenticationFailed("Missing Firebase ID token")

        if id_token.startswith("Bearer "):
            id_token = id_token.split(" ")[1]

        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            firebase_uid = decoded_token['uid']
        except Exception as e:
            raise AuthenticationFailed(f"Invalid Firebase ID token: {str(e)}")

        firebase_user = FirebaseUser.objects.get(firebase_user_id=firebase_uid)
        return PactStatusHistory.objects.filter(pact__firebase_user=firebase_user)

    def create(self, request, *args, **kwargs):
        id_token = request.headers.get('Authorization')
        if not id_token:
            raise AuthenticationFailed("Missing Firebase ID token")

        if id_token.startswith("Bearer "):
            id_token = id_token.split(" ")[1]

        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            firebase_uid = decoded_token['uid']
        except Exception as e:
            raise AuthenticationFailed(f"Invalid Firebase ID token: {str(e)}")

        try:
            firebase_user = FirebaseUser.objects.get(firebase_user_id=firebase_uid)
        except FirebaseUser.DoesNotExist:
            raise AuthenticationFailed("Firebase user not found")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Verify the user owns this pact
        pact = Pact.objects.get(id=request.data['pact'])
        if pact.firebase_user != firebase_user:
            raise AuthenticationFailed("You do not own this pact")

        # Create the status history entry
        history = serializer.save()
        
        # Also update the pact's paused status
        if history.status == 'pause':
            pact.is_paused = True
        elif history.status == 'continue':
            pact.is_paused = False
        pact.save(update_fields=['is_paused'])

        return Response(serializer.data, status=status.HTTP_201_CREATED)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Case, When, IntegerField
from datetime import datetime, timedelta
from django.utils import timezone

# ...existing code...
from rest_framework.decorators import api_view
from django.utils import timezone
from datetime import timedelta

@api_view(['GET'])
def get_stats(request):
    # Extract and verify Firebase ID token
    id_token = request.headers.get('Authorization')
    if not id_token:
        raise AuthenticationFailed("Missing Firebase ID token")

    if id_token.startswith("Bearer "):
        id_token = id_token.split(" ")[1]

    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        firebase_uid = decoded_token['uid']
    except Exception as e:
        raise AuthenticationFailed(f"Invalid Firebase ID token: {str(e)}")

    try:
        firebase_user = FirebaseUser.objects.get(firebase_user_id=firebase_uid)
    except FirebaseUser.DoesNotExist:
        raise AuthenticationFailed("Firebase user not found")

    # Get all user's checkins
    checkins = DailyCheckIn.objects.filter(pact__firebase_user=firebase_user)
    
    # Get current streak
    current_streak = 0
    if checkins.exists():
        today = timezone.now().date()
        date = today
        while True:
            if not checkins.filter(date=date, did_perform_action=True).exists():
                break
            current_streak += 1
            date -= timedelta(days=1)

    # Calculate total checkins and active pacts
    total_checkins = checkins.filter(did_perform_action=True).count()
    active_pacts = Pact.objects.filter(firebase_user=firebase_user, is_active=True).count()

    # Calculate completion rate
    total_days = checkins.count()
    completion_rate = round((total_checkins / total_days * 100) if total_days > 0 else 0)

    # Return the stats as JSON response
    return Response({
        'currentStreak': current_streak,
        'completionRate': completion_rate,
        'totalCheckins': total_checkins,
        'activePacts': active_pacts,
    })



