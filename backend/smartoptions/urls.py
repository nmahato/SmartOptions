from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse
from django.conf import settings
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

def api_root(request):
    return JsonResponse({
        'message': 'SmartOptions API',
        'version': '1.0',
        'endpoints': {
            'auth': '/api/auth/',
            'options': '/api/options/',
            'strategies': '/api/strategies/',
            'alerts': '/api/alerts/',
            'analytics': '/api/analytics/',
            'swagger': '/swagger/',
            'admin': '/admin/'
        }
    })

schema_view = get_schema_view(
   openapi.Info(
      title="SmartOptions API",
      default_version='v1',
      description="Options Strategy Builder & Flow Analytics API",
      contact=openapi.Contact(email="contact@smartoptions.com"),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/strategies/', include('apps.strategies.urls')),
    path('api/options/', include('apps.options.urls')),
    path('api/alerts/', include('apps.alerts.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/market/', include('apps.market_data.urls')),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns