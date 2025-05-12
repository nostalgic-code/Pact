from rest_framework import serializers
from .models import Pact, DailyCheckIn, PactStatusHistory
# Serializers
from rest_framework import serializers


class PactSerializer(serializers.ModelSerializer):
    current_day = serializers.SerializerMethodField()

    class Meta:
        model = Pact
        fields = '__all__'  # or list your fields manually
        read_only_fields = ['firebase_user']

    def get_current_day(self, obj):
        return obj.checkins.filter(did_perform_action=True).count()

class DailyCheckInSerializer(serializers.ModelSerializer):
    pact = serializers.PrimaryKeyRelatedField(queryset=Pact.objects.all())
    
    class Meta:
        model = DailyCheckIn
        fields = '__all__'
        read_only_fields = ['firebase_user', 'date']




class PactStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PactStatusHistory
        fields = '__all__'
