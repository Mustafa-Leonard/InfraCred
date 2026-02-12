from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Confirmation
from .engine import TrustScoringEngine

@receiver(post_save, sender=Confirmation)
def update_trust_on_confirmation(sender, instance, created, **kwargs):
    if created:
        # Re-calculate report score when someone confirms it
        TrustScoringEngine.calculate_report_score(instance.report)
