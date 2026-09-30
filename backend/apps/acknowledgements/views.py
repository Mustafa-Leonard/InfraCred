from rest_framework import viewsets, permissions
from .models import Acknowledgement
from .serializers import AcknowledgementSerializer

class AcknowledgementViewSet(viewsets.ModelViewSet):
    queryset = Acknowledgement.objects.all()
    serializer_class = AcknowledgementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
