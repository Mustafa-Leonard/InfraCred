import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.reports.models import Report
from apps.clustering.models import Cluster
from apps.clustering.tasks import process_report_clustering

reports = Report.objects.filter(cluster__isnull=True)
print(f"Clustering {reports.count()} reports...")
for r in reports:
    process_report_clustering(r.id)

print(f"Total clusters: {Cluster.objects.count()}")
