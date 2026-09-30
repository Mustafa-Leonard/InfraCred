from rest_framework import serializers
from .models import SLAPolicy, SLATracking

class SLAPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = SLAPolicy
        fields = '__all__'

class SLATrackingSerializer(serializers.ModelSerializer):
    policy_name = serializers.ReadOnlyField(source='policy.name')

    class Meta:
        model = SLATracking
        fields = '__all__'
