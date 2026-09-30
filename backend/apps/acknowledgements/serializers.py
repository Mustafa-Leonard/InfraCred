from rest_framework import serializers
from .models import Acknowledgement

class AcknowledgementSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Acknowledgement
        fields = '__all__'
