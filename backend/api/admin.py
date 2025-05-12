from django.contrib import admin
from .models import Pact, DailyCheckIn, PactStatusHistory
# Register your models here.

# Admin
from django.contrib import admin

@admin.register(Pact)
class PactAdmin(admin.ModelAdmin):
    list_display = ('firebase_user', 'action', 'duration_days', 'is_active', 'is_paused', 'is_completed')
    search_fields = ('user__username', 'action')

@admin.register(DailyCheckIn)
class DailyCheckInAdmin(admin.ModelAdmin):
    list_display = ('pact', 'date', 'did_perform_action')
    list_filter = ('did_perform_action', 'date')

@admin.register(PactStatusHistory)
class PactStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ('pact', 'status', 'date')
    list_filter = ('status', 'date')