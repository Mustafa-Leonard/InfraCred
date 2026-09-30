from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('citizen', 'Citizen'),
        ('authority', 'Authority'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='citizen')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    agency = models.ForeignKey('authorities.Agency', on_delete=models.SET_NULL, null=True, blank=True, related_name='agency_users')
    
    def __str__(self):
        return f"{self.username} ({self.role})"
