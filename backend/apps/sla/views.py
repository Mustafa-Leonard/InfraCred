from rest_framework import viewsets, permissions
from .models import SLAPolicy, SLATracking
from .serializers import SLAPolicySerializer, SLATrackingSerializer

class SLAPolicyViewSet(viewsets.ModelViewSet):
    queryset = SLAPolicy.objects.all()
    serializer_class = SLAPolicySerializer
    permission_classes = [permissions.IsAuthenticated]

class SLATrackingViewSet(viewsets.ModelViewSet):
    queryset = SLATracking.objects.all()
    serializer_class = SLATrackingSerializer
    permission_classes = [permissions.IsAuthenticated]
