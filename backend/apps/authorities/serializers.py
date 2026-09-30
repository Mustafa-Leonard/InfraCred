from rest_framework import serializers
from .models import Agency, RoutingRule

class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = '__all__'

class RoutingRuleSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    county_name = serializers.CharField(source='county.name', read_only=True)
    agency_name = serializers.CharField(source='agency.name', read_only=True)
    
    class Meta:
        model = RoutingRule
        fields = '__all__'

