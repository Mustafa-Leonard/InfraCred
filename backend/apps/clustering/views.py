from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Cluster
from .serializers import ClusterSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count

class ClusterViewSet(viewsets.ModelViewSet):
    queryset = Cluster.objects.all().order_by('-created_at')
    serializer_class = ClusterSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active', 'category']

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        cluster = self.get_object()
        
        # Mark cluster as resolved
        cluster.is_active = False
        cluster.resolved_at = timezone.now()
        cluster.save()
        
        # Mark all associated reports as resolved
        reports = cluster.report_set.all()
        for report in reports:
            report.status = 'resolved'
            report.save()
            
        return Response({'status': 'resolved', 'reports_updated': reports.count()})

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Returns analytics data for authority dashboard"""
        # Group by category and count reports
        stats = Cluster.objects.values('category__name').annotate(count=Count('id')).order_by('-count')
        
        # Monthly resolved clusters
        resolved_stats = Cluster.objects.filter(is_active=False).values('resolved_at__month').annotate(count=Count('id'))
        
        return Response({
            'by_category': stats,
            'resolved_monthly': resolved_stats
        })

    def get_queryset(self):
        qs = super().get_queryset()
        # Filter for active only if not specified
        is_active = self.request.query_params.get('is_active')
        if is_active is None:
            # Maybe default to active only for general view
            pass
        return qs
