from rest_framework import serializers
from .models import UserReputation, TrustScore

class UserReputationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserReputation
        fields = ['score', 'total_reports', 'verified_reports', 'last_updated']

class TrustScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrustScore
        fields = ['overall_score', 'reporter_factor', 'confirmation_factor', 'media_factor', 'spatial_factor']
