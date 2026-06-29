from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'sessions', views.SessionViewSet, basename='session')
router.register(r'bookings', views.BookingViewSet, basename='booking')

urlpatterns = [
    path('seed/', views.seed_db, name='seed_db'),
    path('create-payment-intent/', views.CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('', include(router.urls)),
]
