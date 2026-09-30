from rest_framework import serializers
from .models import FieldAssignment

class FieldAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldAssignment
        fields = '__all__'
