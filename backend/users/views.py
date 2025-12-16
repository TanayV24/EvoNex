


from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from .models import User
from .serializers import UserLoginSerializer, UserProfileSerializer
from companies.email import CompanyEmailService
from companies.models import Department


class UserViewSet(viewsets.ViewSet):
    """
    ViewSet for user authentication and profile management
    """
    
    permission_classes = [IsAuthenticated]
    
    # ============================================
    # LOGIN ENDPOINT
    # ============================================
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """
        Login for Manager/HR/Employee users
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
            print(f"✓ User found: {getattr(user, 'name', 'Unknown')} (Role: {getattr(user, 'role', 'Unknown')})")
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
        
        print(f"\n✓ User session created")
        
        # Prepare user response from in-memory object
        user_data = {
            'id': str(user.id),
            'email': user.email,
            'full_name': getattr(user, 'name', ''),
            'phone': getattr(user, 'phone', ''),
            'role': getattr(user, 'role', ''),
            'company_id': getattr(user, 'company_id', None),
            'department_id': str(getattr(user, 'department_id', None)) if getattr(user, 'department_id', None) else None,
            'designation': getattr(user, 'designation', ''),
            'temp_password': getattr(user, 'temp_password', True),
            'profile_completed': getattr(user, 'profile_completed', False),
            'is_active': getattr(user, 'is_active', True),
        }
        
        print(f"\n✅ LOGIN SUCCESSFUL")
        print(f"User: {getattr(user, 'name', 'Unknown')} ({email})")
        print("="*80 + "\n")
        
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
        """
        
        try:
            # ✅ Use request.user directly (already authenticated)
            user = request.user
            
            print(f"\n🔐 PASSWORD CHANGE ATTEMPT")
            print(f"User: {user.email}")
            print(f"User ID: {user.id}")
            print(f"Request user authenticated: {request.user.is_authenticated}")
            
            if not user or not user.is_authenticated:
                return Response({
                    'success': False,
                    'error': 'User not authenticated'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            old_password = request.data.get('old_password')
            new_password = request.data.get('new_password')
            
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
            user.temp_password = False
            user.password_changed_at = timezone.now()
            user.save()
            
            print(f"✓ Password changed")
            
            # ✅ Return response from in-memory user object (NO re-query)
            user_data = {
                'id': str(user.id),
                'email': user.email,
                'full_name': getattr(user, 'name', ''),
                'role': getattr(user, 'role', ''),
                'temp_password': getattr(user, 'temp_password', False),
                'profile_completed': getattr(user, 'profile_completed', False),
            }
            
            print(f"\n✅ PASSWORD CHANGED SUCCESSFULLY")
            print(f"User: {getattr(user, 'name', 'Unknown')} ({user.email})")
            print("="*80 + "\n")
            
            return Response({
                'success': True,
                'data': {
                    'user': user_data
                }
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # ============================================
    # COMPLETE PROFILE ENDPOINT
    # ============================================
    
    @action(detail=False, methods=['post'], url_path='complete_profile')
    def complete_profile(self, request):
        """
        Complete user profile after password change
        """
        try:
            # ✅ Use request.user directly (already authenticated)
            user = request.user
            
            print(f"\n👤 PROFILE COMPLETION ATTEMPT")
            print(f"User: {user.email}")
            print(f"User ID: {user.id}")
            print(f"Request user authenticated: {request.user.is_authenticated}")
            
            if not user or not user.is_authenticated:
                print(f"❌ User not authenticated")
                return Response({
                    'success': False,
                    'error': 'User not authenticated'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            print(f"Current temp_password: {getattr(user, 'temp_password', 'NOT SET')}")
            print(f"Current profile_completed: {getattr(user, 'profile_completed', 'NOT SET')}")
            
            # Get all data from request
            full_name = request.data.get('full_name')
            phone = request.data.get('phone')
            designation = request.data.get('designation')
            department = request.data.get('department')
            gender = request.data.get('gender')
            date_of_birth = request.data.get('date_of_birth')
            address = request.data.get('address')
            city = request.data.get('city')
            state = request.data.get('state')
            country = request.data.get('country')
            pincode = request.data.get('pincode')
            marital_status = request.data.get('marital_status')
            bio = request.data.get('bio')
            
            # Validate required fields
            if not full_name or not designation:
                return Response({
                    'success': False,
                    'error': 'Full name and designation are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get department ID from department name
            company_id = None
            if hasattr(user, 'company_id') and user.company_id:
                company_id = user.company_id
                print(f"✓ Company ID: {company_id}")
            else:
                print(f"⚠ No company_id found for user")
            
            department_id = None
            if department:
                try:
                    print(f"\n🔍 Looking for department: {department}")
                    if company_id:
                        print(f"  Searching in company: {company_id}")
                        dept = Department.objects.get(name__iexact=department, company_id=company_id)
                    else:
                        print(f"  Searching globally (no company_id)")
                        dept = Department.objects.get(name__iexact=department)
                    department_id = dept.id
                    print(f"✓ Department found: {department} (ID: {department_id})")
                except Department.DoesNotExist:
                    print(f"⚠ Department not found: {department}")
                    print(f"  This is OK - profile can be completed without department")
                    department_id = None
            
            # ✅ UPDATE ALL USER FIELDS
            print(f"\n📝 UPDATING USER FIELDS:")
            
            if phone:
                user.phone = phone
                print(f"  ✓ phone = {phone}")
            
            user.name = full_name
            print(f"  ✓ name = {full_name}")
            
            if designation:
                user.designation = designation
                print(f"  ✓ designation = {designation}")
            
            if department_id:
                user.department_id = department_id
                print(f"  ✓ department_id = {department_id}")
            
            # Optional fields
            if gender and hasattr(user, 'gender'):
                user.gender = gender
                print(f"  ✓ gender = {gender}")
            
            if date_of_birth and hasattr(user, 'date_of_birth'):
                user.date_of_birth = date_of_birth
                print(f"  ✓ date_of_birth = {date_of_birth}")
            
            if address and hasattr(user, 'address'):
                user.address = address
                print(f"  ✓ address = {address}")
            
            if city and hasattr(user, 'city'):
                user.city = city
                print(f"  ✓ city = {city}")
            
            if state and hasattr(user, 'state'):
                user.state = state
                print(f"  ✓ state = {state}")
            
            if country and hasattr(user, 'country'):
                user.country = country
                print(f"  ✓ country = {country}")
            
            if pincode and hasattr(user, 'pincode'):
                user.pincode = pincode
                print(f"  ✓ pincode = {pincode}")
            
            if marital_status and hasattr(user, 'marital_status'):
                user.marital_status = marital_status
                print(f"  ✓ marital_status = {marital_status}")
            
            if bio and hasattr(user, 'bio'):
                user.bio = bio
                print(f"  ✓ bio = {bio}")
            
            # Mark profile as completed
            user.profile_completed = True
            print(f"  ✓ profile_completed = TRUE")
            
            # Keep temp_password as False
            user.temp_password = False
            print(f"  ✓ temp_password = FALSE (maintained)")
            
            if hasattr(user, 'profile_completed_at'):
                user.profile_completed_at = timezone.now()
                print(f"  ✓ profile_completed_at = NOW")
            
            # ✅ SAVE TO DATABASE
            print(f"\n✅ SAVING TO DATABASE...")
            user.save()
            print(f"✓ Save completed")
            
            # ✅ Use in-memory user object for response (NO fresh DB lookup)
            print(f"\n✅ BUILDING RESPONSE FROM IN-MEMORY USER:")
            user_data = {
                'id': str(user.id),
                'email': user.email,
                'full_name': getattr(user, 'name', ''),
                'phone': getattr(user, 'phone', ''),
                'role': getattr(user, 'role', ''),
                'company_id': getattr(user, 'company_id', None),
                'department_id': str(department_id) if department_id else None,
                'designation': getattr(user, 'designation', ''),
                'profile_completed': getattr(user, 'profile_completed', False),
                'temp_password': getattr(user, 'temp_password', False),
            }
            
            print(f"  ✓ id = {user_data['id']}")
            print(f"  ✓ email = {user_data['email']}")
            print(f"  ✓ name = {user_data['full_name']}")
            print(f"  ✓ phone = {user_data['phone']}")
            print(f"  ✓ designation = {user_data['designation']}")
            print(f"  ✓ profile_completed = {user_data['profile_completed']}")
            
            print(f"\n✅ PROFILE COMPLETED SUCCESSFULLY")
            print(f"User: {user_data['full_name']} ({user_data['email']})")
            print("="*80 + "\n")
            
            return Response({
                'success': True,
                'data': {'user': user_data}
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)