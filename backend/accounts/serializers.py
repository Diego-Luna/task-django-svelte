from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import bleach
import re

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                  'password', 'password_confirm')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'email': {'required': True}
        }
    
    def validate_username(self, value):
        """Validate username for security and uniqueness"""
        # Sanitize input
        clean_username = bleach.clean(value, strip=True)
        
        # Check for valid characters
        if not re.match(r'^[a-zA-Z0-9_]+$', clean_username):
            raise serializers.ValidationError(
                "Username can only contain letters, numbers, and underscores"
            )
        
        # Check for uniqueness
        if User.objects.filter(username=clean_username).exists():
            raise serializers.ValidationError("This username is already taken")
        
        return clean_username
    
    def validate_email(self, value):
        """Validate email for security and uniqueness"""
        clean_email = bleach.clean(value, strip=True)
        
        # Check for uniqueness
        if User.objects.filter(email=clean_email).exists():
            raise serializers.ValidationError("This email is already registered")
            
        return clean_email
    
    def validate(self, attrs):
        """Validate that passwords match and meet requirements"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {"password": "Password fields do not match"}
            )
            
        try:
            # Use Django's password validators
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
            
        return attrs
    
    def create(self, validated_data):
        """Create new user with secure password handling"""
        validated_data.pop('password_confirm')
        
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        user.set_password(validated_data['password'])
        user.save()
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for retrieving and updating user profile information"""
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                  'date_joined', 'last_login')
        read_only_fields = ('id', 'username', 'date_joined', 'last_login')