from rest_framework import serializers
from .models import User
from companies.models import Department
from .models import User
import re

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'temp_password', 'profile_completed']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'description', 'company_id', 'head_id']

class AddDepartmentSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, required=True)
    code = serializers.CharField(max_length=10, required=True)
    description = serializers.CharField(max_length=500, required=True)
    
    def validate_code(self, value):
        code = value.strip().upper()
        if len(code) < 3 or len(code) > 4:
            raise serializers.ValidationError("Code must be 3-4 characters")
        if not code.isalnum():
            raise serializers.ValidationError("Code must be alphanumeric only")
        return code
    
    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters")
        return value.strip()
    
    def validate_description(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Description must be at least 5 characters")
        return value.strip()

class AddEmployeeSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, required=True)
    email = serializers.EmailField(required=True)
    role = serializers.ChoiceField(choices=['team_lead', 'employee'], required=True)
    department_id = serializers.UUIDField(required=True)
    
    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters")
        return value.strip()
    
    def validate_email(self, value):
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value.strip().lower()):
            raise serializers.ValidationError("Invalid email format")
        return value.strip().lower()
    
    def validate_department_id(self, value):
        try:
            Department.objects.get(id=value)
            return value
        except Department.DoesNotExist:
            raise serializers.ValidationError("Department does not exist")

class EmployeeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'company_id', 'department_id']

# class EmployeeListSerializer(serializers.ModelSerializer):
#     department = serializers.CharField(source='department.name', read_only=True)
#     department_id = serializers.UUIDField(source='department.id', read_only=True)

#     class Meta:
#         model = Employee
#         fields = [
#             'id','name', 'name', 'email','phone', 'status', 'join_date', 'designation', 'location', 'department', 'department_id', ]