import math
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from apps.reports.models import Report
from apps.clustering.models import Cluster
from apps.trust.engine import TrustScoringEngine

def get_distance(p1, p2):
    """Simple distance calculation for lat,lng strings"""
    try:
        lat1, lon1 = map(float, p1.split(','))
        lat2, lon2 = map(float, p2.split(','))
        # This is a very rough approximation for local clustering
        return math.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2)
    except:
        return float('inf')

@shared_task
def process_report_clustering(report_id):
    """
    Spatial Clustering Engine:
    Groups reports based on:
    - Distance (roughly 100-150m)
    - Time Window (72 hours)
    - Infrastructure Type (Category)
    """
    try:
        report = Report.objects.get(id=report_id)
        if report.cluster:
            # Trigger trust score even if already in cluster
            TrustScoringEngine.calculate_report_score(report)
            return

        # 72 hour time window for active clusters
        time_threshold = timezone.now() - timedelta(hours=72)
        
        # Find active clusters for same category within the time window
        active_clusters = Cluster.objects.filter(
            category=report.category, 
            is_active=True,
            created_at__gte=time_threshold
        )
        
        assigned = False
        spatial_threshold = 0.0015 # Roughly 150 meters
        
        for cluster in active_clusters:
            if get_distance(report.location, cluster.center) < spatial_threshold:
                report.cluster = cluster
                report.save()
                assigned = True
                break
        
        if not assigned:
            # Create new cluster
            new_cluster = Cluster.objects.create(
                center=report.location,
                category=report.category,
                radius=150.0
            )
            report.cluster = new_cluster
            report.save()
            
        # Trigger Trust Scoring Engine after clustering
        TrustScoringEngine.calculate_report_score(report)
            
    except Report.DoesNotExist:
        print(f"Report {report_id} not found")
