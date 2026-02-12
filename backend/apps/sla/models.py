from django.db import models
from django.utils import timezone

class SLAPolicy(models.Model):
    name = models.CharField(max_length=100)
    priority_level = models.CharField(max_length=20, unique=True) # medium, high, critical
    resolution_time_hours = models.IntegerField()
    
    def __str__(self):
        return f"{self.name} ({self.priority_level})"

class SLATracking(models.Model):
    case = models.OneToOneField('cases.Case', on_delete=models.CASCADE, related_name='sla_tracking')
    policy = models.ForeignKey(SLAPolicy, on_delete=models.SET_NULL, null=True)
    start_time = models.DateTimeField(auto_now_add=True)
    due_time = models.DateTimeField()
    is_breached = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if not self.due_time and self.policy:
            self.due_time = timezone.now() + timezone.timedelta(hours=self.policy.resolution_time_hours)
        super().save(*args, **kwargs)

    def check_status(self):
        if not self.is_breached and timezone.now() > self.due_time:
            self.is_breached = True
            self.save()
        return self.is_breached
