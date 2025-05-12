from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import pytz


class FirebaseUser(models.Model):
    firebase_user_id = models.CharField(max_length=255, unique=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.firebase_user_id
class Pact(models.Model):
    firebase_user = models.ForeignKey(FirebaseUser, on_delete=models.CASCADE, related_name='pacts', null=True)
    action = models.CharField(max_length=255)
    duration_days = models.PositiveIntegerField()
    start_date = models.DateField()  # Removed auto_now_add
    is_active = models.BooleanField(default=True)
    is_paused = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)

    # ✅ Add this field
    current_day = models.PositiveIntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.start_date:
            sa_tz = pytz.timezone("Africa/Johannesburg")
            self.start_date = timezone.now().astimezone(sa_tz).date()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Pact: {self.action} ({self.duration_days} days)"


class DailyCheckIn(models.Model):
    pact = models.ForeignKey(Pact, on_delete=models.CASCADE, related_name='checkins')
    date = models.DateField()  # Removed auto_now_add
    did_perform_action = models.BooleanField()
    note = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('pact', 'date')
        ordering = ['-date']

    def save(self, *args, **kwargs):
        if not self.date:
            sa_tz = pytz.timezone("Africa/Johannesburg")
            self.date = timezone.now().astimezone(sa_tz).date()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Check-in for {self.date}: {'Yes' if self.did_perform_action else 'No'}"


class PactStatusHistory(models.Model):
    STATUS_CHOICES = [
        ('continue', 'Continue'),
        ('pause', 'Pause'),
        ('pivot', 'Pivot'),
    ]

    pact = models.ForeignKey(Pact, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    date = models.DateField(auto_now_add=True)  # Changed to auto_now_add
    reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.pact} - {self.status} on {self.date}"
