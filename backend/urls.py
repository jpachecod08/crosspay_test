from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views as drf_auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', drf_auth_views.obtain_auth_token, name='api_token_auth'),
    path('api/', include('backend.transactions.urls')),

]
