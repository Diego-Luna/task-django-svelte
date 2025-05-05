# backend/tasks/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Task
from .serializers import TaskSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
import logging

logger = logging.getLogger('django.security')

class TaskRateThrottle(AnonRateThrottle):
    rate = '60/minute'  # Limit to 60 requests per minute for anonymous users

class UserTaskRateThrottle(UserRateThrottle):
    rate = '120/minute'  # Higher limit for authenticated users

class TaskViewSet(viewsets.ModelViewSet):
    """ViewSet for Task model with security controls"""
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filterset_fields = ['status']
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    throttle_classes = [TaskRateThrottle, UserTaskRateThrottle]
    # Uncomment for production when authentication is set up
    # permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_client_ip(self, request):
        """Extract the client IP address for logging"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '')
        return ip
    
    def get_throttles(self):
        """Return appropriate throttling class based on authentication status"""
        if self.request.user.is_authenticated:
            self.throttle_classes = [UserTaskRateThrottle]
        else:
            self.throttle_classes = [TaskRateThrottle]
        return [throttle() for throttle in self.throttle_classes]
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Create task with transaction protection and security logging"""
        try:
            client_ip = self.get_client_ip(request)
            logger.info(f"Task create attempt from {client_ip}")
            
            # Validate request data
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                logger.warning(f"Invalid task data from {client_ip}: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
            # Create task
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            
            logger.info(f"Task created successfully: id={serializer.data.get('id')}")
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            
        except ValidationError as e:
            logger.warning(f"Validation error during task creation: {str(e)}")
            return Response({"detail": "Validation error", "errors": str(e)}, 
                          status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log the error but don't expose details in response
            logger.error(f"Error creating task: {str(e)}")
            return Response({"detail": "Server error processing task creation"},
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        """Update task with transaction protection and security logging"""
        try:
            client_ip = self.get_client_ip(request)
            task_id = kwargs.get('pk')
            logger.info(f"Task update attempt: id={task_id}, from {client_ip}")
            
            # Get instance and validate input
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
            
            if not serializer.is_valid():
                logger.warning(f"Invalid task update data from {client_ip}: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # Update task
            self.perform_update(serializer)
            logger.info(f"Task updated successfully: id={task_id}")
            
            return Response(serializer.data)
            
        except ValidationError as e:
            logger.warning(f"Validation error during task update: {str(e)}")
            return Response({"detail": "Validation error", "errors": str(e)},
                          status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error updating task: {str(e)}")
            return Response({"detail": "Server error processing task update"},
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        """Delete task with security logging"""
        try:
            client_ip = self.get_client_ip(request)
            task_id = kwargs.get('pk')
            logger.info(f"Task delete attempt: id={task_id}, from {client_ip}")
            
            # Get instance and delete
            instance = self.get_object()
            self.perform_destroy(instance)
            
            logger.info(f"Task deleted successfully: id={task_id}")
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        except Exception as e:
            logger.error(f"Error deleting task: {str(e)}")
            return Response({"detail": "Server error processing deletion"},
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)