# companies/views.py - COMPLETE AND CORRECT

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Company, CompanyAdmin, CompanyRegistrationToken
from .serializers import (
    CompanyRegisterSerializer,
    CompanyAdminCreateSerializer,
    CompanyAdminLoginSerializer,
    ChangePasswordSerializer,
    DashboardDataSerializer,
    CompanySetupSerializer
)
from .email import CompanyEmailService
import uuid
from django.utils import timezone


# ============================================
# COMPANY VIEWSET - Registration
# ============================================

class CompanyViewSet(viewsets.ModelViewSet):
    """
    ViewSet for company operations
    
    Endpoints:
    - POST /api/companies/register/
    """
    
    queryset = Company.objects.all()
    serializer_class = CompanyRegisterSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """
        Register a new company
        
        Request:
        POST /api/companies/register/
        {
            "name": "TechCorp India",
            "email": "contact@techcorp.com",
            "phone": "+91-9876543210",
            "website": "https://techcorp.com",
            "address": "123 Tech Street",
            "city": "Bangalore",
            "state": "Karnataka",
            "country": "India",
            "pincode": "560001",
            "timezone": "Asia/Kolkata",
            "currency": "INR"
        }
        
        Response:
        {
            "success": true,
            "data": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "name": "TechCorp India",
                "code": "TECHCORP_INDIA",
                "email": "contact@techcorp.com",
                "registration_status": "pending"
            }
        }
        """
        
        serializer = CompanyRegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            company = serializer.save()
            
            return Response({
                'success': True,
                'data': {
                    'id': str(company.id),
                    'name': company.name,
                    'code': company.code,
                    'email': company.email,
                    'registration_status': company.registration_status
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# ============================================
# AUTH VIEWSET - Login, Admin Creation
# ============================================

class AuthViewSet(viewsets.ViewSet):
    """
    ViewSet for authentication operations
    
    Endpoints:
    - POST /api/auth/create-admin/
    - POST /api/auth/login/
    - POST /api/auth/change-temp-password/
    """
    
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """
        Login with company email and password - WITH DEBUG LOGGING
        """
        email = request.data.get('email')
        password = request.data.get('password')
        
        print("\n" + "="*80)
        print("🔐 LOGIN ATTEMPT")
        print(f"Email: {email}")
        print(f"Password received: {password}")
        print(f"Password length: {len(password) if password else 0}")
        print("="*80)
        
        if not email or not password:
            print("❌ Missing email or password")
            return Response({
                'success': False,
                'error': 'Email and password required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Try to find user by email
        print(f"\n🔍 Searching for user with email: {email}")
        try:
            user = User.objects.get(email=email)
            print(f"✓ User found: {user.username}")
            print(f"  - ID: {user.id}")
            print(f"  - Email: {user.email}")
            print(f"  - Password stored: {user.password[:50]}...")
        except User.DoesNotExist:
            print(f"❌ User NOT found with email: {email}")
            # Debug: Show all users in database
            all_users = User.objects.all()
            print(f"📋 Total users in DB: {all_users.count()}")
            for u in all_users:
                print(f"   - {u.username} ({u.email})")
            return Response({
                'success': False,
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check password - handle BOTH hashed and plain text
        password_valid = False
        print(f"\n🔐 Checking password...")
        
        # Try hashed password first (proper way)
        print(f"  Try 1: Hashed password check...")
        if user.check_password(password):
            password_valid = True
            print(f"  ✓ Password valid (HASHED)")
        else:
            print(f"  ✗ Hashed check failed")
        
        # Try plain text password (for admin-created users)
        if not password_valid:
            print(f"  Try 2: Plain text password check...")
            if user.password == password:
                password_valid = True
                print(f"  ✓ Password valid (PLAIN TEXT)")
                # Auto-hash it for future logins
                user.set_password(password)
                user.save()
                print(f"  ✓ Password hashed and saved")
            else:
                print(f"  ✗ Plain text check failed")
                print(f"    Database password: {user.password}")
                print(f"    Provided password: {password}")
                print(f"    Match: {user.password == password}")
        
        if not password_valid:
            print(f"❌ PASSWORD INVALID - All checks failed")
            return Response({
                'success': False,
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        print(f"✓ Password authentication successful")
        
        # Generate JWT tokens
        print(f"\n🎫 Generating JWT tokens...")
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        print(f"✓ Tokens generated successfully")
        
        # Get CompanyAdmin to check if temp password and get additional info
        print(f"\n👤 Fetching CompanyAdmin info...")
        try:
            admin = CompanyAdmin.objects.get(user=user)
            temp_password = admin.temp_password_set
            company_id = str(admin.company.id)
            company_name = admin.company.name
            full_name = admin.full_name
            print(f"✓ CompanyAdmin found:")
            print(f"  - Full Name: {full_name}")
            print(f"  - Company: {company_name}")
            print(f"  - Temp Password Set: {temp_password}")
        except CompanyAdmin.DoesNotExist:
            print(f"⚠️ CompanyAdmin NOT found for user: {user.username}")
            print(f"   Creating default response without company info")
            temp_password = False
            company_id = None
            company_name = "Unknown"
            full_name = user.first_name or user.username
        
        # Get company_setup_completed from CompanyAdmin
        company_setup_completed = False
        try:
            company_setup_completed = admin.company_setup_completed
        except:
            company_setup_completed = False

        response_data = {
            'success': True,
            'data': {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'full_name': full_name,
                    'company_id': company_id,
                    'company_name': company_name,
                    'temp_password': temp_password,
                    'company_setup_completed': company_setup_completed,  # ← ADD THIS
                    'role': request.data.get('role', 'admin')
                }
            }
        }

        
        print(f"\n✅ LOGIN SUCCESSFUL")
        print(f"User: {full_name} ({email})")
        print(f"Company: {company_name}")
        print("="*80 + "\n")
        
        return Response(response_data, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # ← ADD THE METHOD HERE (after login method)
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated], url_path='change_temp_password')
    def change_temp_password(self, request):
        """Change temporary password to permanent password"""
        from django.utils import timezone
        
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        # Validation
        if not old_password or not new_password:
            return Response({
                'success': False,
                'error': 'Old and new passwords are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(new_password) < 8:
            return Response({
                'success': False,
                'error': 'New password must be at least 8 characters'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify old password
        if not user.check_password(old_password):
            return Response({
                'success': False,
                'error': 'Current password is incorrect'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        # Update CompanyAdmin
        try:
            admin = CompanyAdmin.objects.get(user=user)
            admin.temp_password_set = False
            admin.password_changed_at = timezone.now()
            admin.save()
        except CompanyAdmin.DoesNotExist:
            pass
        
        return Response({
            'success': True,
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated], url_path='company_setup')
    def company_setup(self, request):
        """
        Company first-time setup endpoint
        Path: /api/auth/company_setup/
        """
        try:
            user = request.user
            company_admin = CompanyAdmin.objects.get(user=user)
            
            print("\n" + "="*80)
            print("🏢 COMPANY SETUP")
            print(f"Admin: {company_admin.full_name}")
            print(f"Company: {company_admin.company.name}")
            print("="*80)
            
            # Check if already setup
            if company_admin.company_setup_completed:
                return Response({
                    'success': False,
                    'error': 'Company setup already completed'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Log received data
            print(f"\n📦 Received data: {request.data}")

            # Validate request data
            serializer = CompanySetupSerializer(data=request.data)
            if not serializer.is_valid():
                print(f"❌ Validation errors: {serializer.errors}")
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

            validated_data = serializer.validated_data
            print(f"✓ Validated data: {validated_data}")

            
            # Get company
            company = company_admin.company
            
            # Update company info
            company.name = validated_data.get('company_name', company.name)
            company.website = validated_data.get('company_website', company.website or '')
            company.save()
            
            print(f"✓ Company updated: {company.name}")
            
            # Update company admin setup info
            company_admin.company_name = validated_data.get('company_name')
            company_admin.company_website = validated_data.get('company_website', '')
            company_admin.company_industry = validated_data.get('company_industry', '')
            company_admin.timezone = validated_data.get('timezone', 'IST')
            company_admin.currency = validated_data.get('currency', 'INR')
            company_admin.total_employees = validated_data.get('total_employees', 0)
            company_admin.working_hours_start = validated_data.get('working_hours_start', '09:00')
            company_admin.working_hours_end = validated_data.get('working_hours_end', '18:00')
            company_admin.casual_leave_days = validated_data.get('casual_leave_days', 12)
            company_admin.sick_leave_days = validated_data.get('sick_leave_days', 6)
            company_admin.personal_leave_days = validated_data.get('personal_leave_days', 2)
            
            # Mark setup as completed
            company_admin.company_setup_completed = True
            company_admin.setup_completed_at = timezone.now()
            company_admin.save()
            
            print(f"✓ Setup completed at: {company_admin.setup_completed_at}")
            print("="*80 + "\n")
            
            return Response({
                'success': True,
                'message': 'Company setup completed successfully'
            }, status=status.HTTP_200_OK)
            
        except CompanyAdmin.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Company admin not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"❌ Setup error: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# ============================================
# ADMIN DASHBOARD VIEWSET
# ============================================

class AdminDashboardViewSet(viewsets.ViewSet):
    """
    ViewSet for admin dashboard operations

    Endpoints:
    - GET /api/admin/profile/
    - PUT /api/admin/profile/
    - POST /api/admin/avatar/
    - GET /api/admin/notifications/
    - PUT /api/admin/notifications/
    - POST /api/admin/change_password/
    - GET /api/admin/sessions/
    - POST /api/admin/sessions/{id}/logout/
    - PUT /api/admin/appearance/
    """
    permission_classes = [IsAuthenticated]

    # PROFILE
    @action(detail=False, methods=['get', 'put'], url_path='profile')
    def profile(self, request):
        user = request.user
        try:
            admin = CompanyAdmin.objects.get(user=user)
        except CompanyAdmin.DoesNotExist:
            return Response({'success': False, 'error': 'Admin profile not found'},
                            status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            return Response({
                'success': True,
                'data': {
                    'full_name': admin.full_name,
                    'email': user.email,
                    'phone': admin.phone or '',
                    'department': 'Admin',
                    'avatar': admin.avatar.url if getattr(admin, 'avatar', None) else None,
                }
            })

        full_name = request.data.get('full_name')
        phone = request.data.get('phone')

        if full_name:
            admin.full_name = full_name
            user.first_name = full_name.split()[0]
            user.save()
        if phone is not None:
            admin.phone = phone
        admin.save()

        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'data': {
                'full_name': admin.full_name,
                'email': user.email,
                'phone': admin.phone or '',
            }
        })

    # AVATAR
    @action(detail=False, methods=['post'], url_path='avatar')
    def avatar(self, request):
        user = request.user
        try:
            admin = CompanyAdmin.objects.get(user=user)
        except CompanyAdmin.DoesNotExist:
            return Response({'success': False, 'error': 'Admin profile not found'},
                            status=status.HTTP_404_NOT_FOUND)

        avatar_file = request.FILES.get('avatar')
        if not avatar_file:
            return Response({'success': False, 'error': 'No avatar file provided'},
                            status=status.HTTP_400_BAD_REQUEST)

        if avatar_file.size > 5 * 1024 * 1024:
            return Response({'success': False, 'error': 'File size exceeds 5MB limit'},
                            status=status.HTTP_400_BAD_REQUEST)

        admin.avatar = avatar_file
        admin.save()

        return Response({
            'success': True,
            'message': 'Avatar uploaded successfully',
            'data': {'avatar_url': admin.avatar.url if admin.avatar else None}
        })

    # NOTIFICATIONS
    @action(detail=False, methods=['get', 'put'], url_path='notifications')
    def notifications(self, request):
        # For now, just echo settings; can be stored in DB later
        if request.method == 'GET':
            return Response({
                'success': True,
                'data': {
                    'email_notifications': True,
                    'push_notifications': True,
                    'sms_notifications': False,
                    'leave_approvals': True,
                    'task_assignments': True,
                    'payroll_updates': True,
                }
            })
        data = {
            'email_notifications': request.data.get('email_notifications', True),
            'push_notifications': request.data.get('push_notifications', True),
            'sms_notifications': request.data.get('sms_notifications', False),
            'leave_approvals': request.data.get('leave_approvals', True),
            'task_assignments': request.data.get('task_assignments', True),
            'payroll_updates': request.data.get('payroll_updates', True),
        }
        return Response({
            'success': True,
            'message': 'Notification settings updated successfully',
            'data': data
        })

    # CHANGE PASSWORD (for Settings.tsx)
    @action(detail=False, methods=['post'], url_path='change_password')
    def change_password(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not old_password or not new_password or not confirm_password:
            return Response({'success': False, 'error': 'All fields are required'},
                            status=status.HTTP_400_BAD_REQUEST)
        if new_password != confirm_password:
            return Response({'success': False, 'error': 'New passwords do not match'},
                            status=status.HTTP_400_BAD_REQUEST)
        if len(new_password) < 8:
            return Response({'success': False, 'error': 'Password must be at least 8 characters'},
                            status=status.HTTP_400_BAD_REQUEST)
        if not user.check_password(old_password):
            return Response({'success': False, 'error': 'Current password is incorrect'},
                            status=status.HTTP_401_UNAUTHORIZED)

        user.set_password(new_password)
        user.save()

        try:
            admin = CompanyAdmin.objects.get(user=user)
            admin.temp_password_set = False
            admin.password_changed_at = timezone.now()
            admin.save()
        except CompanyAdmin.DoesNotExist:
            pass

        return Response({'success': True, 'message': 'Password changed successfully'})

    # SESSIONS (mock)
    @action(detail=False, methods=['get'], url_path='sessions')
    def sessions(self, request):
        return Response({
            'success': True,
            'data': [
                {
                    'id': '1',
                    'browser': 'Chrome',
                    'device': 'Windows',
                    'location': 'New York, US',
                    'ip_address': '192.168.1.1',
                    'last_active': 'Just now',
                    'is_current': True,
                }
            ]
        })

    @action(detail=False, methods=['post'], url_path='sessions/(?P<session_id>[^/.]+)/logout')
    def logout_session(self, request, session_id=None):
        if session_id in ('1', 'current'):
            return Response({'success': False, 'error': 'Cannot logout current session'},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response({'success': True, 'message': 'Session logged out successfully'})

    # APPEARANCE
    @action(detail=False, methods=['put'], url_path='appearance')
    def appearance(self, request):
        user = request.user
        try:
            admin = CompanyAdmin.objects.get(user=user)
        except CompanyAdmin.DoesNotExist:
            return Response({'success': False, 'error': 'Admin profile not found'},
                            status=status.HTTP_404_NOT_FOUND)

        theme = request.data.get('theme', 'system')
        language = request.data.get('language', 'en')
        tz_choice = request.data.get('timezone', admin.timezone)

        admin.timezone = tz_choice
        admin.save()

        return Response({
            'success': True,
            'message': 'Appearance settings updated successfully',
            'data': {
                'theme': theme,
                'language': language,
                'timezone': tz_choice,
            }
        })

    