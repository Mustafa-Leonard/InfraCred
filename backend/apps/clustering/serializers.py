from rest_framework import serializers
from .models import Cluster
from apps.cases.serializers import CaseSerializer
from apps.reports.serializers import ReportSerializer

class ClusterSerializer(serializers.ModelSerializer):
    report_count = serializers.IntegerField(source='report_set.count', read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')
    case = CaseSerializer(read_only=True)
    reports = ReportSerializer(source='report_set', many=True, read_only=True)

    class Meta:
        model = Cluster
        fields = ['id', 'center', 'radius', 'category', 'category_name', 'is_active', 'created_at', 'report_count', 'case', 'reports']
