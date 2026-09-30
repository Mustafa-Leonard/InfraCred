from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FieldAssignmentViewSet

router = DefaultRouter()
router.register(r'assignments', FieldAssignmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
