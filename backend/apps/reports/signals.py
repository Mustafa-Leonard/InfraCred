from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Report
from apps.clustering.tasks import process_report_clustering

from apps.trust.engine import ReputationEngine, TrustScoringEngine

@receiver(post_save, sender=Report)
def report_post_save(sender, instance, created, **kwargs):
    from apps.notifications.models import Notification

    if created:
        # Initial clustering
        if not instance.cluster:
            process_report_clustering.delay(instance.id)
        # Setup initial trust score
        TrustScoringEngine.calculate_report_score(instance)
        
        # Notify user (confirmation of receipt)
        Notification.objects.create(
            user=instance.reporter,
            notification_type='report_created',
            title='Report Received',
            message=f"Your report regarding '{instance.category.name}' has been received and is pending review.",
            report=instance
        )

    else:
        # If status changed, notify user
        # We can optimize this by checking if status actually changed using pre_save or fetching from db,
        # but for MVP this is acceptable if we assume save happens on change.
        # However, to avoid spam, let's just trigger on significant status updates if we can. 
        # Since we don't have the old instance easily here without pre_save, we will assume the view handles explicit status updates.
        # But wait, post_save is triggered on every save.
        # Let's add partial simple logic:
        
        # Notify on Resolution
        if instance.status == 'resolved':
             Notification.objects.create(
                user=instance.reporter,
                notification_type='report_resolved',
                title='Issue Resolved!',
                message=f"Good news! The '{instance.category.name}' issue you reported has been marked as resolved.",
                report=instance
            )
        elif instance.status == 'rejected':
             Notification.objects.create(
                user=instance.reporter,
                notification_type='report_rejected',
                title='Report Update',
                message=f"Your report regarding '{instance.category.name}' has been reviewed and closed.",
                report=instance
            )
        elif instance.status == 'in_progress':
             Notification.objects.create(
                user=instance.reporter,
                notification_type='report_in_progress',
                title='Work in Progress',
                message=f"Authority teams are now working on the '{instance.category.name}' issue you reported.",
                report=instance
            )

        # If status changed, update reputation
        ReputationEngine.update_user_reputation(instance.reporter)
        # Re-calc trust score as spatial factor or confirmation might have changed
        TrustScoringEngine.calculate_report_score(instance)
