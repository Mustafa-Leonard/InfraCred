from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AgencyViewSet,
    RoutingRuleViewSet
)

router = DefaultRouter()
router.register(r'agencies', AgencyViewSet)
router.register(r'routing-rules', RoutingRuleViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
