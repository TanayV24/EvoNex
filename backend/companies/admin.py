# companies/admin.py - FIXED VERSION

from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import Company, CompanyAdmin, CompanyRegistrationToken
from .email import CompanyEmailService
import secrets
import string


# ============================================
# CUSTOM USER ADMIN - Disable direct User creation
# ============================================

class CustomUserAdmin(BaseUserAdmin):
    """
    Custom User Admin that prevents direct user creation
    """
    
    def has_add_permission(self, request):
        """Disable adding users directly - use CompanyAdmin instead"""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion through User admin"""
        return False


# Unregister the default User admin and register custom one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


# ============================================
# COMPANY ADMIN
# ============================================

@admin.register(Company)
class CompanyAdminPanel(admin.ModelAdmin):
    list_display = ('name', 'email', 'code', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'email', 'code')
    readonly_fields = ('id', 'code', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'code', 'email', 'phone', 'website')
        }),
        ('Address', {
            'fields': ('address', 'city', 'state', 'country', 'pincode')
        }),
        ('Settings', {
            'fields': ('timezone', 'currency', 'is_active')
        }),
        ('Status', {
            'fields': ('registration_status', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


# ============================================
# COMPANY ADMIN USER - With auto-create
# ============================================

@admin.register(CompanyAdmin)
class CompanyAdminUserAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'company', 'get_email', 'is_verified', 'temp_password_set', 'created_at')
    list_filter = ('is_verified', 'temp_password_set', 'company', 'created_at')
    search_fields = ('full_name', 'personal_email', 'user__email', 'phone')
    readonly_fields = ('id', 'user', 'created_at', 'updated_at', 'password_changed_at')
    
    fieldsets = (
        ('User Information', {
            'fields': ('id', 'full_name', 'personal_email', 'phone')
        }),
        ('Company Association', {
            'fields': ('company', 'user')
        }),
        ('Verification Status', {
            'fields': ('is_verified', 'temp_password_set', 'password_changed_at'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_email(self, obj):
        """Display company email"""
        return obj.user.email if obj.user else format_html('<span style="color: orange;">N/A</span>')
    get_email.short_description = 'Company Email'
    
    def save_model(self, request, obj, form, change):
        """
        Override save to:
        1. Create Django User if not exists
        2. Generate temp password
        3. Send email
        """
        
        if not change:  # Creating new admin user
            # Generate company email
            company_code = obj.company.code.lower()
            company_email = f"admin@{company_code.replace('_', '')}.com"
            
            # Generate secure temporary password
            password = self._generate_temp_password()
            
            # Create Django User
            user, created = User.objects.get_or_create(
                username=company_email,
                defaults={
                    'email': company_email,
                    'first_name': obj.full_name.split()[0] if obj.full_name else '',
                    'last_name': ' '.join(obj.full_name.split()[1:]) if obj.full_name else '',
                    'is_staff': True,
                    'is_active': True,
                }
            )
            
            # Set password
            user.set_password(password)
            user.save()
            
            # Attach user to CompanyAdmin
            obj.user = user
            obj.temp_password_set = True
            
            # Save CompanyAdmin
            super().save_model(request, obj, form, change)
            
            # Send email with credentials
            try:
                CompanyEmailService.send_admin_credentials(
                personal_email=obj.personal_email,
                company_name=obj.company.name,
                admin_email=user.email,
                temp_password=password,
                token=None
            )
                self.message_user(request, f'✅ Welcome email sent to {obj.personal_email}')
            except Exception as e:
                self.message_user(request, f'⚠️ User created but email failed: {str(e)}', level='warning')
        else:
            # Just save if updating
            super().save_model(request, obj, form, change)
    
    def _generate_temp_password(self, length=16):
        """Generate a secure temporary password"""
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        return ''.join(secrets.choice(alphabet) for i in range(length))


# ============================================
# COMPANY REGISTRATION TOKEN ADMIN
# ============================================

@admin.register(CompanyRegistrationToken)
class CompanyRegistrationTokenAdmin(admin.ModelAdmin):
    list_display = ('company', 'token_preview', 'is_used_status', 'token_validity', 'created_at', 'expires_at')
    list_filter = ('is_used', 'created_at')
    search_fields = ('company__name', 'token')
    readonly_fields = ('token', 'created_at')
    
    fieldsets = (
        ('Token Information', {
            'fields': ('token', 'company')
        }),
        ('Status', {
            'fields': ('is_used', 'used_at', 'used_by_email'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'expires_at'),
            'classes': ('collapse',)
        }),
    )
    
    def token_preview(self, obj):
        """Display first 20 chars of token"""
        return f"{obj.token[:20]}..." if obj.token else "N/A"
    token_preview.short_description = 'Token (Preview)'
    
    def is_used_status(self, obj):
        """Display token usage status with color"""
        if obj.is_used:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Used</span>'
            )
        else:
            return format_html(
                '<span style="color: orange; font-weight: bold;">✗ Not Used</span>'
            )
    is_used_status.short_description = 'Status'
    
    def token_validity(self, obj):
        """Display token validity status"""
        if obj.is_valid():
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Valid</span>'
            )
        else:
            return format_html(
                '<span style="color: red; font-weight: bold;">✗ Expired</span>'
            )
    token_validity.short_description = 'Validity'
    
    def has_add_permission(self, request):
        """Prevent manual token creation"""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Allow deletion only if token not used"""
        if obj and obj.is_used:
            return False
        return super().has_delete_permission(request, obj)