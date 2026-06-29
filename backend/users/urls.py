from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, OAuthLoginView

router = DefaultRouter()
router.register(r'', UserViewSet)

urlpatterns = [
    path('auth/oauth/', OAuthLoginView.as_view(), name='oauth_login'),
    path('', include(router.urls)),
]
