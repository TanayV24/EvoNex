# users/views.py - USER AUTHENTICATION ENDPOINTS

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from .models import User
from .serializers import UserLoginSerializer, UserProfileSerializer
from companies.email import CompanyEmailService

class UserViewSet(viewsets.ViewSet):
    """
    ViewSet for user authentication and profile management
    
    Endpoints:
    - POST /api/users/login/ → Manager/HR/Employee login
    - POST /api/users/change_password/ → Change password after login
    - POST /api/users/profile/complete/ → Complete profile after password change
    """
    
    permission_classes = [IsAuthenticated]
    
    # ============================================
    # LOGIN ENDPOINT
    # ============================================
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """
        Login for Manager/HR/Employee users
        
        Request:
        {
            "email": "manager@company.com",
            "password": "temp_password_123"
        }
        
        Response:
        {
            "success": true,
            "data": {
                "token": "...",
                "refresh_token": "...",
                "user": {
                    "id": "...",
                    "email": "manager@company.com",
                    "full_name": "Manager Name",
                    "role": "manager",
                    "temp_password": true,
                    "profile_completed": false,
                    "company_id": "..."
                }
            }
        }
        """
        
        email = request.data.get('email')
        password = request.data.get('password')
        
        print("\n" + "="*80)
        print("🔐 USER LOGIN ATTEMPT")
        print(f"Email: {email}")
        print(f"Password length: {len(password) if password else 0}")
        print("="*80)
        
        if not email or not password:
            return Response({
                'success': False,
                'error': 'Email and password required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Find user by email
        try:
            user = User.objects.get(email=email)
            print(f"✓ User found: {user.full_name} (Role: {user.role})")
        except User.DoesNotExist:
            print(f"❌ User NOT found with email: {email}")
            return Response({
                'success': False,
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check password
        if not user.check_password(password):
            print(f"❌ Password check failed")
            return Response({
                'success': False,
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        print(f"✓ Password verified")
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        # Update last login
        user.last_login = timezone.now()
        user.save()
        
        # Prepare user response
        user_data = {
            'id': str(user.id),
            'email': user.email,
            'full_name': user.full_name,
            'phone': user.phone or '',
            'role': user.role,
            'company_id': str(user.company_id),
            'department_id': str(user.department_id) if user.department_id else None,
            'designation': user.designation or '',
            'temp_password': user.temp_password,  # ✅ Critical flag
            'profile_completed': user.profile_completed,  # ✅ Critical flag
            'is_active': user.is_active,
        }
        
        print(f"✓ Login successful - temp_password={user.temp_password}")
        
        return Response({
            'success': True,
            'data': {
                'token': access_token,
                'refresh_token': refresh_token,
                'user': user_data
            }
        }, status=status.HTTP_200_OK)
    
    # ============================================
    # CHANGE PASSWORD ENDPOINT
    # ============================================
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """
        Change temporary password for Manager/HR/Employee
        
        Request:
        {
            "old_password": "temp_password_123",
            "new_password": "NewPassword123!"
        }
        
        Response (IMPORTANT):
        {
            "success": true,
            "data": {
                "user": {
                    "id": "...",
                    "email": "...",
                    "role": "...",
                    "temp_password": false,  ← MUST BE FALSE
                    "profile_completed": false
                }
            }
        }
        """
        
        try:
            # Get user from request (JWT authenticated)
            # For SimpleJWT, we need to get user_id from token
            from rest_framework_simplejwt.authentication import JWTAuthentication
            auth = JWTAuthentication()
            
            # User already in request from authentication
            user = User.objects.get(id=request.user.id) if hasattr(request.user, 'id') else None
            
            if not user:
                return Response({
                    'success': False,
                    'error': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            old_password = request.data.get('old_password')
            new_password = request.data.get('new_password')
            
            print(f"\n🔐 PASSWORD CHANGE ATTEMPT")
            print(f"User: {user.email}")
            print(f"Old password length: {len(old_password) if old_password else 0}")
            print(f"New password length: {len(new_password) if new_password else 0}")
            
            # Validate inputs
            if not old_password or not new_password:
                return Response({
                    'success': False,
                    'error': 'Old and new passwords required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify old password
            if not user.check_password(old_password):
                print(f"❌ Old password incorrect")
                return Response({
                    'success': False,
                    'error': 'Invalid old password'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            print(f"✓ Old password verified")
            
            # Set new password
            user.set_password(new_password)
            user.temp_password = False  # ✅ CRITICAL: Mark password as changed
            user.password_changed_at = timezone.now()
            user.save()
            
            print(f"✓ Password changed and marked as non-temporary")
            
            # Return updated user data
            user_data = {
                'id': str(user.id),
                'email': user.email,
                'full_name': user.full_name,
                'role': user.role,
                'temp_password': False,  # ✅ MUST BE FALSE
                'profile_completed': user.profile_completed,
            }
            
            return Response({
                'success': True,
                'data': {
                    'user': user_data
                }
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # ============================================
    # COMPLETE PROFILE ENDPOINT
    # ============================================
    
    @action(detail=False, methods=['post'], url_path='profile/complete')
    def complete_profile(self, request):
        """
        Complete user profile after password change
        
        Request:
        {
            "full_name": "John Manager",
            "phone": "+91-9876543210",
            "department": "HR",
            "designation": "Manager"
        }
        
        Response:
        {
            "success": true,
            "data": {
                "user": {
                    "id": "...",
                    "email": "...",
                    "profile_completed": true  ← MUST BE TRUE
                }
            }
        }
        """
        
        try:
            # Get authenticated user
            user = request.user
            
            print(f"\n👤 PROFILE COMPLETION ATTEMPT")
            print(f"User: {user.email}")
            
            # Get data from request
            full_name = request.data.get('full_name')
            phone = request.data.get('phone')
            department = request.data.get('department')
            designation = request.data.get('designation')
            
            # Validate required fields
            if not full_name or not department:
                return Response({
                    'success': False,
                    'error': 'Full name and department are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Update user profile
            user.full_name = full_name
            if phone:
                user.phone = phone
            user.department_name = department
            if designation:
                user.designation = designation
            
            # Mark profile as completed
            user.mark_profile_completed()  # Sets profile_completed=True and profile_completed_at
            
            print(f"✓ Profile completed for {user.full_name}")
            
            user_data = {
                'id': str(user.id),
                'email': user.email,
                'full_name': user.full_name,
                'phone': user.phone,
                'department': user.department_name,
                'designation': user.designation,
                'role': user.role,
                'profile_completed': True,  # ✅ MUST BE TRUE
            }
            
            return Response({
                'success': True,
                'data': {
                    'user': user_data
                }
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)