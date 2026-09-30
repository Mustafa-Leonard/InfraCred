from rest_framework import serializers
from .models import InfrastructureType, Category, Report

class InfrastructureTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfrastructureType
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    reporter_name = serializers.ReadOnlyField(source='reporter.username')
    infra_type_name = serializers.ReadOnlyField(source='infra_type.name')
    category_name = serializers.ReadOnlyField(source='category.name')
    confirmation_count = serializers.IntegerField(source='confirmations.count', read_only=True)
    overall_trust_score = serializers.ReadOnlyField(source='trust_score.overall_score')

    is_confirmed_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = (
            'id', 'reporter', 'reporter_name', 'infra_type', 'infra_type_name',
            'category', 'category_name', 'description', 'location', 'address',
            'image', 'status', 'confirmation_count', 'is_confirmed_by_user', 'overall_trust_score', 'cluster', 'created_at'
        )
        read_only_fields = ('id', 'reporter', 'status', 'cluster', 'created_at')

    def get_is_confirmed_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.confirmations.filter(user=request.user).exists()
        return False

class ReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = (
            'infra_type', 'category', 'description', 'location', 'address', 'image'
        )
