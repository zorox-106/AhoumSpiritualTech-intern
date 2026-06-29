from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SessionViewSet, BookingViewSet, CreatePaymentIntentView

router = DefaultRouter()
router.register(r'sessions', SessionViewSet, basename='session')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('create-payment-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('', include(router.urls)),
]
