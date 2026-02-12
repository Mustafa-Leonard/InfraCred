from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InfrastructureTypeViewSet, CategoryViewSet, ReportViewSet

router = DefaultRouter()
router.register(r'types', InfrastructureTypeViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'reports', ReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
