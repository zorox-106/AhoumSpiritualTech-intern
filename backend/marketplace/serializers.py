from rest_framework import serializers
from .models import Session, Booking
from users.serializers import UserSerializer

class SessionSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    
    class Meta:
        model = Session
        fields = ['id', 'creator', 'title', 'description', 'price', 'start_time', 'end_time', 'max_capacity', 'image_url', 'is_active', 'created_at']
        read_only_fields = ('creator', 'created_at', 'updated_at')

class BookingSerializer(serializers.ModelSerializer):
    session = SessionSerializer(read_only=True)
    session_id = serializers.PrimaryKeyRelatedField(
        queryset=Session.objects.filter(is_active=True), 
        source='session', 
        write_only=True
    )
    user = UserSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('user', 'status', 'booking_date')

    def validate(self, data):
        session = data['session']
        if session.bookings.count() >= session.max_capacity:
            raise serializers.ValidationError("This session is fully booked.")
        return data
