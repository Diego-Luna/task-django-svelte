import type { Task, TaskFilter } from '$lib/types';

const API_URL = 'http://localhost:8000/api';

export async function fetchTasks(filter: TaskFilter = 'all'): Promise<Task[]> {
  try {
    const url = filter !== 'all' 
      ? `${API_URL}/tasks/?status=${filter}` 
      : `${API_URL}/tasks/`;
      
    const response = await fetch(url);
    
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
    const response = await fetch(`${API_URL}/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
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
    const response = await fetch(`${API_URL}/tasks/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
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
    const response = await fetch(`${API_URL}/tasks/${id}/`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting task: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}