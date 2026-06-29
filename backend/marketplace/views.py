from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from .models import Session, Booking
from users.models import User
from .serializers import SessionSerializer, BookingSerializer
from django.conf import settings
from rest_framework.views import APIView
import stripe
import os

stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', '')

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def seed_db(request):
    try:
        creator1, _ = User.objects.get_or_create(
            email='sadhguru@ahoum.com', 
            defaults={'username': 'sadhguru', 'role': 'CREATOR', 'first_name': 'Sadhguru', 'last_name': 'Jaggi', 'avatar_url': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Sadhguru_Jaggi_Vasudev.jpg'}
        )
        creator2, _ = User.objects.get_or_create(
            email='sri@ahoum.com', 
            defaults={'username': 'srisri', 'role': 'CREATOR', 'first_name': 'Sri Sri', 'last_name': 'Ravi Shankar', 'avatar_url': 'https://upload.wikimedia.org/wikipedia/commons/9/93/Sri_Sri_Ravi_Shankar_in_2017.jpg'}
        )
        if Session.objects.count() == 0:
            Session.objects.create(
                creator=creator1,
                title='Inner Engineering Masterclass',
                description='A comprehensive guide to managing your inner energies and finding ultimate peace through ancient yogic sciences.',
                price=199.99,
                start_time=timezone.now() + timedelta(days=2),
                end_time=timezone.now() + timedelta(days=2, hours=2),
                max_capacity=50
            )
            Session.objects.create(
                creator=creator2,
                title='Art of Living Workshop',
                description='Discover the power of breathing techniques (Sudarshan Kriya) and meditation to relieve stress and anxiety.',
                price=149.00,
                start_time=timezone.now() + timedelta(days=5),
                end_time=timezone.now() + timedelta(days=5, hours=3),
                max_capacity=100
            )
            return Response({"message": "Successfully seeded the database!"})
        else:
            return Response({"message": "Sessions already exist. Skipping seed."})
    except Exception as e:
        # Return detailed error for debugging
        return Response({"error": str(e)}, status=500)

class IsCreatorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'CREATOR'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.creator == request.user

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.filter(is_active=True).order_by('start_time')
    serializer_class = SessionSerializer
    permission_classes = [IsCreatorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_sessions(self, request):
        if request.user.role != 'CREATOR':
            return Response({'detail': 'Only creators can view their sessions.'}, status=status.HTTP_403_FORBIDDEN)
        sessions = Session.objects.filter(creator=request.user)
        serializer = self.get_serializer(sessions, many=True)
        return Response(serializer.data)

class CreatePaymentIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        session_id = request.data.get('session_id')
        try:
            session_obj = Session.objects.get(id=session_id, is_active=True)
        except Session.DoesNotExist:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Create a PaymentIntent with the order amount and currency
            intent = stripe.PaymentIntent.create(
                amount=int(session_obj.price * 100), # amount in cents
                currency='usd',
                metadata={'session_id': session_id, 'user_id': request.user.id},
                automatic_payment_methods={
                    'enabled': True,
                },
            )
            return Response({'clientSecret': intent.client_secret})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users see their bookings, Creators see bookings for their sessions
        user = self.request.user
        if user.role == 'CREATOR':
            return Booking.objects.filter(session__creator=user)
        return Booking.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        print("INCOMING BOOKING DATA:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("SERIALIZER ERRORS:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        session_obj = serializer.validated_data['session']
        payment_intent_id = request.data.get('payment_intent_id')

        if not payment_intent_id:
            print("NO PAYMENT INTENT ID")
            return Response({'error': 'Payment Intent ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            if intent.status != 'succeeded':
                print("PAYMENT NOT SUCCEEDED:", intent.status)
                return Response({'error': 'Payment not successful.'}, status=status.HTTP_400_BAD_REQUEST)
            if str(getattr(intent.metadata, 'session_id', '')) != str(session_obj.id):
                print("PAYMENT SESSION MISMATCH", getattr(intent.metadata, 'session_id', ''), session_obj.id)
                return Response({'error': 'Payment Intent does not match this session.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            print("STRIPE EXCEPTION TYPE:", type(e))
            print("STRIPE EXCEPTION TRACEBACK:")
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        from django.db import IntegrityError
        try:
            self.perform_create(serializer)
        except IntegrityError:
            return Response({'error': 'You have already booked this session.'}, status=status.HTTP_400_BAD_REQUEST)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status='CONFIRMED')
