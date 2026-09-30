from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AcknowledgementViewSet

router = DefaultRouter()
router.register(r'acknowledgements', AcknowledgementViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
