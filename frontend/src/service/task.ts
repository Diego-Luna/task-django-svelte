import type { Task, TaskFilter } from '$lib/types';
import { sanitizeInput, getCSRFToken } from '$lib/utils/security';

const API_URL = 'http://localhost:8000/api';

export async function fetchTasks(filter: TaskFilter = 'all'): Promise<Task[]> {
  try {
    // Sanitizar el parámetro de filtro
    const safeFilter = ['all', 'todo', 'done'].includes(filter) ? filter : 'all';
    
    const url = safeFilter !== 'all' 
      ? `${API_URL}/tasks/?status=${safeFilter}` 
      : `${API_URL}/tasks/`;
      
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include', // Incluir cookies en la solicitud
      headers: {
        'Accept': 'application/json'
      }
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
      description: task.description ? sanitizeInput(task.description) : null
    };
    
    const response = await fetch(`${API_URL}/tasks/`, {
      method: 'POST',
      credentials: 'include', // Incluir cookies
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRFToken': getCSRFToken() || '' // Agregar token CSRF
      },
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
    if (task.title !== undefined) sanitizedTask.title = sanitizeInput(task.title);
    if (task.description !== undefined) sanitizedTask.description = task.description ? sanitizeInput(task.description) : null;
    
    const response = await fetch(`${API_URL}/tasks/${id}/`, {
      method: 'PATCH',
      credentials: 'include', // Incluir cookies
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRFToken': getCSRFToken() || '' // Agregar token CSRF
      },
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
      credentials: 'include', // Incluir cookies
      headers: {
        'X-CSRFToken': getCSRFToken() || '' // Agregar token CSRF
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting task: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}