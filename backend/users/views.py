# users/views.py - CORRECTED VERSION

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserSerializer
from companies.models import CompanyAdmin
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login endpoint
    Expects: { "email": "user@example.com", "password": "password123", "role": "admin" }
    Returns: { "access_token": "...", "refresh_token": "...", "user": {...} }
    """
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role', 'admin')
    
    print("\n" + "="*80)
    print("LOGIN ENDPOINT CALLED")
    print(f"Email: {email}")
    print(f"Password: {'*' * len(password)}")
    print(f"Role: {role}")
    print("="*80 + "\n")
    
    # Validate input
    if not email or not password:
        print("❌ Missing email or password")
        return Response(
            {
                'success': False,
                'message': 'Email and password are required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Authenticate user
    try:
        # Try to find user by email
        user = User.objects.get(email=email)
        print(f"✓ User found: {user.username}")
    except User.DoesNotExist:
        print(f"❌ User not found with email: {email}")
        return Response(
            {
                'success': False,
                'message': 'Invalid credentials'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Check password
    if not user.check_password(password):
        print(f"❌ Password incorrect for user: {user.username}")
        return Response(
            {
                'success': False,
                'message': 'Invalid credentials'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    print(f"✓ Password correct")
    
    # Get or create CompanyAdmin
    try:
        company_admin = CompanyAdmin.objects.get(user=user)
        print(f"✓ CompanyAdmin found: {company_admin.full_name}")
        company_id = company_admin.company.id
        company_name = company_admin.company.name
        full_name = company_admin.full_name
        temp_password = company_admin.temp_password_set
    except CompanyAdmin.DoesNotExist:
        print(f"⚠️  CompanyAdmin not found for user: {user.username}")
        company_id = None
        company_name = "Unknown"
        full_name = user.first_name or user.username
        temp_password = False
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)
    
    print(f"✓ Tokens generated")
    print(f"✓ Access Token: {access_token[:20]}...")
    print(f"✓ Refresh Token: {refresh_token[:20]}...")
    
    # Build response
    response_data = {
        'success': True,
        'message': 'Login successful',
        'data': {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': full_name,
                'role': role,
                'company_id': company_id,
                'company_name': company_name,
                'temp_password': temp_password,
            }
        }
    }
    
    print("\n✅ LOGIN SUCCESSFUL")
    print(f"Response: {response_data}")
    print("="*80 + "\n")
    
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    """Logout endpoint"""
    return Response(
        {
            'success': True,
            'message': 'Logged out successfully'
        },
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change password endpoint"""
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    if not user.check_password(old_password):
        return Response(
            {
                'success': False,
                'message': 'Old password is incorrect'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.set_password(new_password)
    user.save()
    
    # Update CompanyAdmin temp_password_set to False
    try:
        company_admin = CompanyAdmin.objects.get(user=user)
        company_admin.temp_password_set = False
        company_admin.password_changed_at = datetime.now()
        company_admin.save()
    except CompanyAdmin.DoesNotExist:
        pass
    
    return Response(
        {
            'success': True,
            'message': 'Password changed successfully'
        },
        status=status.HTTP_200_OK
    )