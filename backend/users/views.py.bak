from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import User
from companies.models import Department
import logging

logger = logging.getLogger(__name__)


class UserViewSet(viewsets.ViewSet):
    """
    ViewSet for user profile management
    
    ✅ UNIFIED ENDPOINTS IN companies/views.py:
    - POST /api/auth/login/          (for ALL users)
    - POST /api/auth/change_temp_password/  (for ALL users)
    
    ✅ PROFILE COMPLETION ENDPOINT (only in this viewset):
    - POST /api/users/complete_profile/
    """
    permission_classes = [IsAuthenticated]

    # ============================================
    # COMPLETE PROFILE ENDPOINT
    # ============================================

    @action(detail=False, methods=['post'], url_path='complete_profile')
    def complete_profile(self, request):
        """
        Complete user profile after password change
        Path: /api/users/complete_profile/
        
        For: HR/Manager/Employee users ONLY (after temp password change)
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

            # Get custom user from users table
            try:
                custom_user = User.objects.get(email=user.email)
            except User.DoesNotExist:
                print(f"❌ User not found in users table")
                return Response({
                    'success': False,
                    'error': 'User profile not found in system'
                }, status=status.HTTP_404_NOT_FOUND)

            print(f"Current temp_password: {getattr(custom_user, 'temp_password', 'NOT SET')}")
            print(f"Current profile_completed: {getattr(custom_user, 'profile_completed', 'NOT SET')}")

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
            if hasattr(custom_user, 'company_id') and custom_user.company_id:
                company_id = custom_user.company_id
                print(f"✓ Company ID: {company_id}")
            else:
                print(f"⚠ No company_id found for user")

            department_id = None
            if department:
                try:
                    print(f"\n🔍 Looking for department: {department}")
                    if company_id:
                        print(f" Searching in company: {company_id}")
                        dept = Department.objects.get(name__iexact=department, company_id=company_id)
                    else:
                        print(f" Searching globally (no company_id)")
                        dept = Department.objects.get(name__iexact=department)
                    
                    department_id = dept.id
                    print(f"✓ Department found: {department} (ID: {department_id})")
                except Department.DoesNotExist:
                    print(f"⚠ Department not found: {department}")
                    print(f" This is OK - profile can be completed without department")
                    department_id = None

            # ✅ UPDATE ALL USER FIELDS
            print(f"\n📝 UPDATING USER FIELDS:")

            if phone:
                custom_user.phone = phone
                print(f" ✓ phone = {phone}")

            custom_user.name = full_name
            print(f" ✓ name = {full_name}")

            if designation:
                custom_user.designation = designation
                print(f" ✓ designation = {designation}")

            if department_id:
                custom_user.department_id = department_id
                print(f" ✓ department_id = {department_id}")

            # Optional fields
            if gender and hasattr(custom_user, 'gender'):
                custom_user.gender = gender
                print(f" ✓ gender = {gender}")

            if date_of_birth and hasattr(custom_user, 'date_of_birth'):
                custom_user.date_of_birth = date_of_birth
                print(f" ✓ date_of_birth = {date_of_birth}")

            if address and hasattr(custom_user, 'address'):
                custom_user.address = address
                print(f" ✓ address = {address}")

            if city and hasattr(custom_user, 'city'):
                custom_user.city = city
                print(f" ✓ city = {city}")

            if state and hasattr(custom_user, 'state'):
                custom_user.state = state
                print(f" ✓ state = {state}")

            if country and hasattr(custom_user, 'country'):
                custom_user.country = country
                print(f" ✓ country = {country}")

            if pincode and hasattr(custom_user, 'pincode'):
                custom_user.pincode = pincode
                print(f" ✓ pincode = {pincode}")

            if marital_status and hasattr(custom_user, 'marital_status'):
                custom_user.marital_status = marital_status
                print(f" ✓ marital_status = {marital_status}")

            if bio and hasattr(custom_user, 'bio'):
                custom_user.bio = bio
                print(f" ✓ bio = {bio}")

            # Mark profile as completed
            custom_user.profile_completed = True
            print(f" ✓ profile_completed = TRUE")

            # Keep temp_password as False
            custom_user.temp_password = False
            print(f" ✓ temp_password = FALSE (maintained)")

            if hasattr(custom_user, 'profile_completed_at'):
                custom_user.profile_completed_at = timezone.now()
                print(f" ✓ profile_completed_at = NOW")

            # ✅ SAVE TO DATABASE
            print(f"\n✅ SAVING TO DATABASE...")
            custom_user.save()
            print(f"✓ Save completed")

            # ✅ Use in-memory user object for response (NO fresh DB lookup)
            print(f"\n✅ BUILDING RESPONSE FROM IN-MEMORY USER:")

            user_data = {
                'id': str(custom_user.id),
                'email': custom_user.email,
                'full_name': getattr(custom_user, 'name', ''),
                'phone': getattr(custom_user, 'phone', ''),
                'role': getattr(custom_user, 'role', ''),
                'company_id': getattr(custom_user, 'company_id', None),
                'department_id': str(department_id) if department_id else None,
                'designation': getattr(custom_user, 'designation', ''),
                'profile_completed': getattr(custom_user, 'profile_completed', False),
                'temp_password': getattr(custom_user, 'temp_password', False),
            }

            print(f" ✓ id = {user_data['id']}")
            print(f" ✓ email = {user_data['email']}")
            print(f" ✓ name = {user_data['full_name']}")
            print(f" ✓ phone = {user_data['phone']}")
            print(f" ✓ designation = {user_data['designation']}")
            print(f" ✓ profile_completed = {user_data['profile_completed']}")

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