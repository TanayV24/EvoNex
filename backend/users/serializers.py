# users/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from companies.models import CompanyAdmin


class UserSerializer(serializers.ModelSerializer):
    """Serializer for Django User model"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active']
        read_only_fields = ['id']


class CompanyAdminSerializer(serializers.ModelSerializer):
    """Serializer for CompanyAdmin model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CompanyAdmin
        fields = ['id', 'user', 'company', 'full_name', 'personal_email', 'phone', 'is_verified', 'created_at']
        read_only_fields = ['id', 'created_at']