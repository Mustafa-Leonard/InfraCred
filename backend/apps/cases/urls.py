from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CaseViewSet, CaseUpdateViewSet

router = DefaultRouter()
router.register(r'cases', CaseViewSet)
router.register(r'updates', CaseUpdateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
