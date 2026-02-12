from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JurisdictionViewSet, CountyViewSet

router = DefaultRouter()
router.register(r'jurisdictions', JurisdictionViewSet)
router.register(r'counties', CountyViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
