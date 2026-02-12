from django.db import models
from django.conf import settings

class AuthorityProfile(models.Model):
    PERMISSION_LEVELS = (
        ('standard', 'Standard User'),
        ('manager', 'Manager'),
        ('admin', 'Authority Admin'),
    )
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='authority_profile')
    agency = models.ForeignKey('authorities.Agency', on_delete=models.CASCADE, related_name='member_profiles', null=True, blank=True)
    permission_level = models.CharField(max_length=20, choices=PERMISSION_LEVELS, default='standard')
    
    def __str__(self):
        return f"{self.user.username} - {self.agency.name if self.agency else 'No Agency'} ({self.permission_level})"

