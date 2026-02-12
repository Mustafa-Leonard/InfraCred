from rest_framework import viewsets, permissions
from .models import Jurisdiction, County
from .serializers import JurisdictionSerializer, CountySerializer

class JurisdictionViewSet(viewsets.ModelViewSet):
    queryset = Jurisdiction.objects.all()
    serializer_class = JurisdictionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CountyViewSet(viewsets.ModelViewSet):
    queryset = County.objects.all()
    serializer_class = CountySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

