from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Q
from django.core.exceptions import ValidationError
from .models import Task
from .serializers import TaskSerializer
from .permissions import IsOwnerOrReadGlobalOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
import logging

logger = logging.getLogger('django.security')

class TaskRateThrottle(AnonRateThrottle):
    rate = '30/minute'  # Limit to 30 requests per minute for anonymous users

class UserTaskRateThrottle(UserRateThrottle):
    rate = '100/minute'  # Higher limit for authenticated users

class TaskViewSet(viewsets.ModelViewSet):
    """ViewSet for Task model with security controls and user ownership"""
    serializer_class = TaskSerializer
    filterset_fields = ['status', 'visibility']
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    throttle_classes = [TaskRateThrottle, UserTaskRateThrottle]
    permission_classes = [IsOwnerOrReadGlobalOnly]
    
    def get_queryset(self):
        """Filter tasks based on user authentication and ownership"""
        if self.request.user.is_authenticated:
            # Return global tasks + user's private tasks
            return Task.objects.filter(
                Q(visibility='global') | Q(user=self.request.user)
            ).select_related('user')
        else:
            # Return only global tasks for anonymous users
            return Task.objects.filter(visibility='global').select_related('user')
    
    def get_client_ip(self, request):
        """Extract the client IP address for logging"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '')
        return ip
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Create task with transaction protection, security logging, and user assignment"""
        try:
            client_ip = self.get_client_ip(request)
            username = request.user.username if request.user.is_authenticated else 'anonymous'
            logger.info(f"Task create attempt from {client_ip} by user: {username}")
            
            # Prepare data with proper visibility for anonymous users
            request_data = request.data.copy()
            
            if not request.user.is_authenticated:
                # Forzar visibilidad global para usuarios anónimos
                request_data['visibility'] = 'global'
            
            # Validate request data
            serializer = self.get_serializer(data=request_data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # Asignar usuario solo si está autenticado
            if request.user.is_authenticated:
                task = serializer.save(user=request.user)
            else:
                task = serializer.save(user=None)
            
            logger.info(f"Task created successfully: id={task.id} by user: {username}")
            return Response(self.get_serializer(task).data, status=status.HTTP_201_CREATED)
            
        except ValidationError as e:
            logger.warning(f"Validation error during task creation: {str(e)}")
            return Response({"detail": "Validation error", "errors": str(e)}, 
                        status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
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
            
            # Get instance and check permissions
            instance = self.get_object()
            
            # Validate input
            serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
            if not serializer.is_valid():
                logger.warning(f"Invalid task update data from {client_ip}: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # Update task (user field is read-only, so it will not be changed)
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
        """Delete task with security logging and ownership check"""
        try:
            client_ip = self.get_client_ip(request)
            task_id = kwargs.get('pk')
            logger.info(f"Task delete attempt: id={task_id}, from {client_ip}")
            
            # Get instance (this will check permissions via IsOwnerOrReadGlobalOnly)
            instance = self.get_object()
            self.perform_destroy(instance)
            
            logger.info(f"Task deleted successfully: id={task_id}")
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        except Exception as e:
            logger.error(f"Error deleting task: {str(e)}")
            return Response({"detail": "Server error processing deletion"},
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)