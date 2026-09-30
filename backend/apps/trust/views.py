from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Confirmation, UserReputation
from .serializers import UserReputationSerializer
from apps.reports.models import Report
from django.shortcuts import get_object_or_404

class UserReputationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        reputation, _ = UserReputation.objects.get_or_create(user=request.user)
        serializer = UserReputationSerializer(reputation)
        return Response(serializer.data)

class ConfirmationCreateView(generics.CreateAPIView):
    queryset = Confirmation.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        report_id = self.kwargs.get('report_id')
        report = get_object_or_404(Report, id=report_id)
        
        confirmation, created = Confirmation.objects.get_or_create(
            user=request.user,
            report=report
        )
        
        if not created:
            return Response({"detail": "Already confirmed."}, status=status.HTTP_200_OK)
            
        return Response({"detail": "Report confirmed."}, status=status.HTTP_201_CREATED)
