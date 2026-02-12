from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import AuthorityProfile
from .serializers import AuthorityProfileSerializer

class AuthorityProfileViewSet(viewsets.ModelViewSet):
    queryset = AuthorityProfile.objects.all()
    serializer_class = AuthorityProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['user__username', 'agency__name', 'user__first_name', 'user__last_name']

    def perform_create(self, serializer):
        # Prioritize agency from request if provided (e.g. by admin)
        agency_id = self.request.data.get('agency')
        if agency_id:
            serializer.save(agency_id=agency_id)
            return

        # Fallback to same agency as current user
        agency = getattr(self.request.user, 'agency', None)
        if not agency and hasattr(self.request.user, 'authority_profile'):
             agency = self.request.user.authority_profile.agency
        
        serializer.save(agency=agency)

    def get_queryset(self):
        # Optimize query
        qs = AuthorityProfile.objects.select_related('user', 'agency').all().order_by('-id')
        
        user = self.request.user
        
        # Superusers see everything
        if user.is_superuser:
            return qs

        # Others see only their agency
        agency = getattr(user, 'agency', None)
        
        if not agency and hasattr(user, 'authority_profile'):
            agency = user.authority_profile.agency
            
        if agency:
            return qs.filter(agency=agency)
            
        return qs.none()

    def perform_destroy(self, instance):
        # Delete user account along with profile
        user = instance.user
        instance.delete()
        user.delete()
