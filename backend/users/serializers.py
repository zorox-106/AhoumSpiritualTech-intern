from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'avatar_url', 'first_name', 'last_name')
        read_only_fields = ('id', 'email', 'role')

class OAuthLoginSerializer(serializers.Serializer):
    provider = serializers.ChoiceField(choices=['google', 'github'])
    token = serializers.CharField()
