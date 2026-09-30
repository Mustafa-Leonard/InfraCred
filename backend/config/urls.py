from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # App endpoints
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/geo/', include('apps.geo.urls')),
    path('api/reports/', include('apps.reports.urls')),
    path('api/trust/', include('apps.trust.urls')),
    path('api/clustering/', include('apps.clustering.urls')),
    path('api/authorities/', include('apps.authorities.urls')),
    path('api/cases/', include('apps.cases.urls')),
    path('api/assignments/', include('apps.assignments.urls')),
    path('api/acknowledgements/', include('apps.acknowledgements.urls')),
    path('api/sla/', include('apps.sla.urls')),
    path('api/authority_users/', include('apps.authority_users.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
