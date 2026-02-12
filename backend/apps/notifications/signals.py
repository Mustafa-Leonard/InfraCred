from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification

# Empty signals file to satisfy the import in apps.py
# We can add actual signals here if needed later
