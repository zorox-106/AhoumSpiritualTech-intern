import os
import django
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from users.models import User
from marketplace.models import Session

def seed_data():
    print("Seeding database...")
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
        Session.objects.create(
            creator=creator1,
            title='Morning Yoga & Dhyana',
            description='Start your day with gentle yoga stretches followed by guided dhyana (meditation) for a productive day.',
            price=25.00,
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=1, hours=1),
            max_capacity=20
        )
        print("Successfully created 3 sessions!")
    else:
        print("Sessions already exist. Skipping seed.")

if __name__ == '__main__':
    seed_data()
