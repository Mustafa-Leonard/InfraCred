from django.db import models
from django.conf import settings

class Case(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('feedback_required', 'Feedback Required'),
        ('resolved', 'Resolved'),
        ('re_routed', 'Re-Routed'),
        ('escalated', 'Escalated'),
    )
    
    cluster = models.OneToOneField('clustering.Cluster', on_delete=models.CASCADE, related_name='case')
    agency = models.ForeignKey('authorities.Agency', on_delete=models.SET_NULL, null=True, blank=True, related_name='cases')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, default='medium')
    routing_reason = models.TextField(blank=True)
    classification_confidence = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Case for Cluster {self.cluster.id} ({self.status}) - {self.agency.name if self.agency else 'Unassigned'}"


class CaseUpdate(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='updates')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=100)
    comments = models.TextField(blank=True)
    attachment = models.FileField(upload_to='case_updates/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
