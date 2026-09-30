from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClusterViewSet

router = DefaultRouter()
router.register(r'clusters', ClusterViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
