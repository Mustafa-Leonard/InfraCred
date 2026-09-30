from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import InfrastructureType, Category, Report
from .serializers import (
    InfrastructureTypeSerializer, CategorySerializer,
    ReportSerializer, ReportCreateSerializer
)

class InfrastructureTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InfrastructureType.objects.all()
    serializer_class = InfrastructureTypeSerializer
    permission_classes = [permissions.AllowAny]

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['infra_type']

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().order_by('-created_at')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'infra_type', 'category', 'cluster']
    search_fields = ['address', 'description']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReportCreateSerializer
        return ReportSerializer

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

    @action(detail=False, methods=['get'])
    def my_reports(self, request):
        """Return all reports for the current user without pagination"""
        queryset = self.get_queryset().filter(reporter=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Stats for the citizen dashboard"""
        user = request.user
        my_reports = Report.objects.filter(reporter=user)
        
        return Response({
            'total_reports': my_reports.count(),
            'pending_reports': my_reports.filter(status='pending').count(),
            'resolved_reports': my_reports.filter(status='resolved').count(),
            'in_progress_reports': my_reports.filter(status='in_progress').count(),
        })

    @action(detail=False, methods=['get'])
    def authority_stats(self, request):
        """Stats for the authority dashboard"""
        from apps.clustering.models import Cluster
        from apps.cases.models import Case
        
        user = request.user
        agency = getattr(user, 'agency', None)
        
        if not agency:
            return Response({
                'error': 'User not associated with any agency.',
                'total_active_clusters': 0,
                'resolved_this_month': 0,
                'pending_unclustered': 0,
                'resolution_rate': 0,
            }, status=200) # Return 200 with zero stats
            
        # Get cases assigned to this user's agency via the new routing system
        agency_cases = Case.objects.filter(agency=agency)
        active_cases = agency_cases.exclude(status='resolved')
        
        return Response({
            'total_active_clusters': active_cases.count(),
            'resolved_this_month': agency_cases.filter(status='resolved', updated_at__month=timezone.now().month).count(),
            'pending_unclustered': Report.objects.filter(cluster__isnull=True).count(), 
            'resolution_rate': 85, # Mock for now
        })

    def get_queryset(self):
        qs = super().get_queryset()
        return qs
