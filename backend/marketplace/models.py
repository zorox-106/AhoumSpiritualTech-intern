from django.db import models
from django.conf import settings

class Session(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_sessions')
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    max_capacity = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.creator.username}"

class Booking(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
    )
    
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='bookings')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='CONFIRMED')
    booking_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('session', 'user')

    def __str__(self):
        return f"{self.user.username} booked {self.session.title}"
