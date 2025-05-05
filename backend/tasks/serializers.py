from rest_framework import serializers
from django.core.validators import RegexValidator
from django.contrib.auth.models import User
from .models import Task
import re
import bleach

class UserMinimalSerializer(serializers.ModelSerializer):
    """Minimal user representation for embedding in Task results"""
    class Meta:
        model = User
        fields = ('id', 'username')
        read_only_fields = fields

class TaskSerializer(serializers.ModelSerializer):
    """Secure serializer for Task model with input validation and sanitization"""
    user = UserMinimalSerializer(read_only=True)
    owner_username = serializers.CharField(source='user.username', read_only=True)
    
    title = serializers.CharField(
        max_length=200,
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9\s\.,!?()-]+$',
                message='Title can only contain letters, numbers, and basic punctuation',
                code='invalid_title'
            )
        ]
    )
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'visibility', 
                  'user', 'owner_username', 'created_at', 'updated_at']
        read_only_fields = ('created_at', 'updated_at', 'user')
    
    def validate_title(self, value):
        """Validate and sanitize the title to prevent injection attacks"""
        # Clean the title using bleach
        clean_title = bleach.clean(value, strip=True)
        
        # Check for minimum length
        if len(clean_title.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters")
            
        # Check for SQL injection patterns
        sql_patterns = re.compile(
            r'(\b(select|insert|update|delete|drop|alter|exec|union|create|where)\b)',
            re.IGNORECASE
        )
        if sql_patterns.search(clean_title):
            raise serializers.ValidationError("Title contains prohibited words")
            
        return clean_title
    
    def validate_description(self, value):
        """Validate and sanitize the description"""
        if value:
            # Check length
            if len(value) > 5000:
                raise serializers.ValidationError("Description must be less than 5000 characters")
                
            # Sanitize the description
            # Allow only basic HTML tags, strip all attributes
            allowed_tags = ['b', 'i', 'u', 'p', 'br', 'ul', 'ol', 'li']
            return bleach.clean(value, tags=allowed_tags, attributes={}, strip=True)
        return value