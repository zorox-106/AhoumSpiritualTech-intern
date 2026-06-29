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
    
    # Delete all old sessions to start fresh
    Session.objects.all().delete()
    
    # New Sessions with images and INR
    sessions_data = [
        {
            "creator": creator1,
            "title": "Inner Engineering Masterclass",
            "description": "A comprehensive guide to managing your inner energies and finding ultimate peace through ancient yogic sciences.",
            "price": 1499.00,
            "max_capacity": 50,
            "image_url": "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&q=80&w=1000",
            "days_offset": 2
        },
        {
            "creator": creator2,
            "title": "Art of Living Workshop",
            "description": "Discover the power of breathing techniques (Sudarshan Kriya) and meditation to relieve stress and anxiety.",
            "price": 999.00,
            "max_capacity": 100,
            "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000",
            "days_offset": 5
        },
        {
            "creator": creator1,
            "title": "Morning Yoga & Dhyana",
            "description": "Start your day with gentle yoga stretches followed by guided dhyana (meditation) for a productive day.",
            "price": 499.00,
            "max_capacity": 20,
            "image_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000",
            "days_offset": 1
        },
        {
            "creator": creator2,
            "title": "Chakra Healing Session",
            "description": "Deeply relaxing session focusing on unblocking your 7 chakras for better energy flow.",
            "price": 799.00,
            "max_capacity": 30,
            "image_url": "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&q=80&w=1000",
            "days_offset": 3
        },
        {
            "creator": creator1,
            "title": "Vipassana Intro Retreat",
            "description": "An introduction to the ancient technique of Vipassana. Learn to see things as they really are.",
            "price": 2499.00,
            "max_capacity": 15,
            "image_url": "https://images.unsplash.com/photo-1528315651484-46bab265de1d?auto=format&fit=crop&q=80&w=1000",
            "days_offset": 10
        },
        {
            "creator": creator2,
            "title": "Sound Bath & Mantra Chanting",
            "description": "Immerse yourself in healing vibrations of Tibetan singing bowls and Vedic mantras.",
            "price": 599.00,
            "max_capacity": 40,
            "image_url": "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80&w=1000",
            "days_offset": 4
        },
        {
            "creator": creator1,
            "title": "Mindful Eating & Ayurveda",
            "description": "Learn the principles of Ayurveda and how to eat mindfully for holistic health.",
            "price": 899.00,
            "max_capacity": 25,
            "image_url": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1000",
            "days_offset": 7
        },
        {
            "creator": creator2,
            "title": "Full Moon Meditation",
            "description": "Harness the lunar energy with this special 90-minute full moon meditation gathering.",
            "price": 399.00,
            "max_capacity": 60,
            "image_url": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80&w=1000",
            "days_offset": 14
        }
    ]
    
    for data in sessions_data:
        Session.objects.create(
            creator=data["creator"],
            title=data["title"],
            description=data["description"],
            price=data["price"],
            start_time=timezone.now() + timedelta(days=data["days_offset"]),
            end_time=timezone.now() + timedelta(days=data["days_offset"], hours=2),
            max_capacity=data["max_capacity"],
            image_url=data["image_url"]
        )
        
    print("Successfully created 8 beautiful Indian sessions!")

if __name__ == '__main__':
    seed_data()
