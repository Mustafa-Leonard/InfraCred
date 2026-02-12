from rest_framework import serializers
from .models import Case, CaseUpdate

class CaseUpdateSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = CaseUpdate
        fields = '__all__'

from apps.assignments.serializers import FieldAssignmentSerializer

class CaseSerializer(serializers.ModelSerializer):
    updates = CaseUpdateSerializer(many=True, read_only=True)
    assignments = FieldAssignmentSerializer(many=True, read_only=True)
    report_count = serializers.IntegerField(source='cluster.report_set.count', read_only=True)

    class Meta:
        model = Case
        fields = '__all__'
