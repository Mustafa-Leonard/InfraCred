from rest_framework import viewsets, permissions
from .models import FieldAssignment
from .serializers import FieldAssignmentSerializer

class FieldAssignmentViewSet(viewsets.ModelViewSet):
    queryset = FieldAssignment.objects.all()
    serializer_class = FieldAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
