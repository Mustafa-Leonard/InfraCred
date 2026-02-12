from rest_framework import viewsets, permissions
from .models import Case, CaseUpdate
from .serializers import CaseSerializer, CaseUpdateSerializer

class CaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # In a real app, filter cases by authority of the user
        return self.queryset

class CaseUpdateViewSet(viewsets.ModelViewSet):
    queryset = CaseUpdate.objects.all()
    serializer_class = CaseUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
