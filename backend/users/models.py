from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('USER', 'User'),
        ('CREATOR', 'Creator'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='USER')
    avatar_url = models.URLField(max_length=500, blank=True, null=True)

    def is_creator(self):
        return self.role == 'CREATOR'
