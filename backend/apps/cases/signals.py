from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Case, CaseUpdate
from apps.clustering.models import Cluster
from apps.authorities.routing import RoutingEngine

@receiver(post_save, sender=Cluster)
def create_case_for_new_cluster(sender, instance, created, **kwargs):
    """
    Automatically create a Case and route it to an Agency when a new Cluster is created.
    """
    if created:
        agency, reason = RoutingEngine.find_best_agency(instance.category, instance.center)
        
        Case.objects.create(
            cluster=instance,
            agency=agency,
            status='open',
            priority='medium',
            routing_reason=reason
        )
        print(f"ROUTING: Created Case for Cluster {instance.id}. {reason}")

@receiver(post_save, sender=Case)
def sync_case_status_to_reports(sender, instance, **kwargs):
    """
    When a case status is updated, sync that status to all individual reports
    in the associated cluster so citizens can see the update.
    """
    from django.utils import timezone
    from apps.reports.models import Report
    
    # Map Case status to Report status
    status_map = {
        'open': 'pending',
        'assigned': 'investigating',
        'in_progress': 'in_progress',
        'feedback_required': 'investigating',
        'resolved': 'resolved',
        're_routed': 'investigating',
        'escalated': 'investigating',
    }
    
    new_report_status = status_map.get(instance.status, 'pending')
    print(f"SYNC: Case {instance.id} status is {instance.status}. Updating reports in cluster {instance.cluster.id} to {new_report_status}")
    
    # Update all reports in the associated cluster
    count = Report.objects.filter(cluster=instance.cluster).update(status=new_report_status)
    print(f"SYNC: Updated {count} reports.")

    # Sync to Cluster state
    cluster = instance.cluster
    if instance.status == 'resolved':
        if cluster.is_active:
            print(f"SYNC: Deactivating cluster {cluster.id}")
            cluster.is_active = False
            cluster.resolved_at = timezone.now()
            cluster.save()
    else:
        if not cluster.is_active:
            print(f"SYNC: Re-activating cluster {cluster.id}")
            cluster.is_active = True
            cluster.resolved_at = None
            cluster.save()

@receiver(post_save, sender=CaseUpdate)
def handle_case_update(sender, instance, created, **kwargs):
    """
    When an update is added to a case, ensure we check the case status again.
    """
    if created:
        # We could potentially do more here, like sending notifications
        pass
