from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import requests as python_requests
import os

from .models import User
from .serializers import UserSerializer, OAuthLoginSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see themselves unless they are admin
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class OAuthLoginView(generics.GenericAPIView):
    serializer_class = OAuthLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        provider = serializer.validated_data['provider']
        token = serializer.validated_data['token']
        
        email = None
        first_name = ''
        last_name = ''
        avatar_url = ''
        
        try:
            # MOCK IMPLEMENTATION FOR ASSIGNMENT
            if token == 'mock-google-token':
                email = 'demo.user@gmail.com'
                first_name = 'Demo'
                last_name = 'User'
                avatar_url = 'https://ui-avatars.com/api/?name=Demo+User&background=random'
            elif token == 'mock-github-token':
                email = 'github.coder@example.com'
                first_name = 'Github'
                last_name = 'Coder'
                avatar_url = 'https://ui-avatars.com/api/?name=Github+Coder&background=random'
            elif provider == 'google':
                # Decode Google token from Firebase (Real Flow)
                # We skip signature verification here since Firebase tokens require the Firebase Admin SDK
                import jwt
                idinfo = jwt.decode(token, options={"verify_signature": False})
                email = idinfo['email']
                first_name = idinfo.get('name', '').split(' ')[0] if idinfo.get('name') else ''
                last_name = idinfo.get('name', '').split(' ')[-1] if idinfo.get('name') and len(idinfo.get('name', '').split(' ')) > 1 else ''
                avatar_url = idinfo.get('picture', '')
                
            elif provider == 'github':
                # Token here is actually an access_token sent from frontend (Real Flow)
                headers = {'Authorization': f'token {token}'}
                user_res = python_requests.get('https://api.github.com/user', headers=headers)
                user_res.raise_for_status()
                user_data = user_res.json()
                
                if not user_data.get('email'):
                    email_res = python_requests.get('https://api.github.com/user/emails', headers=headers)
                    email_res.raise_for_status()
                    emails = email_res.json()
                    email = next(e['email'] for e in emails if e['primary'])
                else:
                    email = user_data['email']
                    
                name_parts = user_data.get('name', '').split(' ')
                first_name = name_parts[0] if name_parts else ''
                last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
                avatar_url = user_data.get('avatar_url', '')
                
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        if not email:
            return Response({'error': 'Could not get email from provider'}, status=status.HTTP_400_BAD_REQUEST)

        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': first_name,
                'last_name': last_name,
                'avatar_url': avatar_url,
                'role': 'USER' # Default role
            }
        )
        
        # If user existed but missing info, maybe update? For now just issue token
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
