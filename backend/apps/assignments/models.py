from django.db import models
from django.conf import settings

class FieldAssignment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('dispatched', 'Dispatched'),
        ('on_site', 'On Site'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    case = models.ForeignKey('cases.Case', on_delete=models.CASCADE, related_name='assignments')
    assigned_to_name = models.CharField(max_length=200) # Name of team or individual
    contact_info = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Assignment for {self.case}: {self.assigned_to_name}"
