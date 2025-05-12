# URLs
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PactViewSet, DailyCheckInViewSet, PactStatusHistoryViewSet, test_cors, get_stats


# router for handling api routes automatically
router = DefaultRouter()
router.register(r'pacts', PactViewSet)
router.register(r'checkins', DailyCheckInViewSet)
router.register(r'status-history', PactStatusHistoryViewSet)

# api endpoints available here.
urlpatterns = [
    path('api/', include(router.urls)),
    # urls.py
    path("api/test-cors", test_cors),
    path('api/stats', get_stats),

    

]
