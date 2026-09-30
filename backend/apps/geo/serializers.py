from rest_framework import serializers
from .models import Jurisdiction, County

class JurisdictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jurisdiction
        fields = '__all__'

class CountySerializer(serializers.ModelSerializer):
    class Meta:
        model = County
        fields = '__all__'

