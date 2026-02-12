from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthorityProfileViewSet

router = DefaultRouter()
router.register(r'profiles', AuthorityProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
