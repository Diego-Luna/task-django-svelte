from rest_framework import permissions

class IsOwnerOrReadGlobalOnly(permissions.BasePermission):
    """
    Permisos personalizados:
    - Usuarios autenticados pueden:
      - Leer todas las tareas globales + sus tareas privadas
      - Crear tareas privadas o globales 
      - Actualizar/eliminar solo sus propias tareas
    - Usuarios no autenticados pueden:
      - Leer todas las tareas globales
      - Crear solo tareas globales
      - Actualizar/eliminar solo tareas sin usuario asignado (anónimas)
    """
    
    def has_permission(self, request, view):
        # Permitir acceso a todos para listado y detalle (GET)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Para crear tareas nuevas (POST), permitir a todos
        if request.method == 'POST':
            return True
            
        # Para actualizar/eliminar, se verificará en has_object_permission
        return True
    
    def has_object_permission(self, request, view, obj):
        # Permitir lectura de tareas globales a todos
        if request.method in permissions.SAFE_METHODS:
            if obj.visibility == 'global':
                return True
            return request.user.is_authenticated and obj.user == request.user
        
        
        # Si es usuario autenticado, solo permitir si es el propietario
        if request.user.is_authenticated:
            return obj.user == request.user
            
        # Si es usuario anónimo, solo permitir si la tarea es anónima (sin usuario asociado)
        return obj.user is None