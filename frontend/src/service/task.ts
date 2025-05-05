
import type { Task, TaskFilter } from '$lib/types/types';
import { sanitizeInput, getCSRFToken } from '$lib/utils/security';
import { auth } from '$lib/stores/auth';
import { get } from 'svelte/store';

const API_URL = 'http://localhost:8000/api';

// Función auxiliar para obtener token de autenticación
function getAuthHeaders() {
  const authState = get(auth);
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  
  if (authState.token) {
    headers['Authorization'] = `Bearer ${authState.token}`;
  }
  
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  return headers;
}

export async function fetchTasks(filter: TaskFilter = 'all'): Promise<Task[]> {
  try {
    // Sanitizar el parámetro de filtro
    const safeFilter = ['all', 'todo', 'done'].includes(filter) ? filter : 'all';
    
    const url = safeFilter !== 'all' 
      ? `${API_URL}/tasks/?status=${safeFilter}` 
      : `${API_URL}/tasks/`;
      
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching tasks: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
  try {
    // Sanitizar entradas de usuario
    const sanitizedTask = {
      ...task,
      title: sanitizeInput(task.title) || '',
      description: task.description ? sanitizeInput(task.description) : null,
      // Si el usuario no está autenticado, forzar a global
      visibility: get(auth).isAuthenticated ? task.visibility : 'global'
    };
    
    const response = await fetch(`${API_URL}/tasks/`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders(),
      body: JSON.stringify(sanitizedTask),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating task: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function updateTask(id: number, task: Partial<Task>): Promise<Task> {
  try {
    // Validar el ID
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('Invalid task ID');
    }
    
    // Sanitizar entradas de usuario si existen en la actualización
    const sanitizedTask: Partial<Task> = { ...task };
    
    if (task.title !== undefined) {
      const sanitizedTitle = sanitizeInput(task.title);
      sanitizedTask.title = sanitizedTitle !== null ? sanitizedTitle : '';
    }
    
    if (task.description !== undefined) {
      sanitizedTask.description = task.description ? sanitizeInput(task.description) : null;
    }
    
    const response = await fetch(`${API_URL}/tasks/${id}/`, {
      method: 'PATCH',
      credentials: 'include',
      headers: getAuthHeaders(),
      body: JSON.stringify(sanitizedTask),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating task: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export async function deleteTask(id: number): Promise<void> {
  try {
    // Validar el ID
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('Invalid task ID');
    }
    
    const response = await fetch(`${API_URL}/tasks/${id}/`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting task: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}