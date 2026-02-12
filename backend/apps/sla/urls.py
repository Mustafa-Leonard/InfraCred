from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SLAPolicyViewSet, SLATrackingViewSet

router = DefaultRouter()
router.register(r'policies', SLAPolicyViewSet)
router.register(r'tracking', SLATrackingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
