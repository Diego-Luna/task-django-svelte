from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tasks', views.TaskViewSet, basename='task')  # Añadir el parámetro basename='task'

urlpatterns = [
    path('', include(router.urls)),
]