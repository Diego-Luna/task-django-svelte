
import type { User } from '$lib/stores/auth';
import { auth } from '$lib/stores/auth';
import { getCSRFToken, sanitizeInput } from '$lib/utils/security';

const API_URL = 'http://localhost:8000/auth';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

export async function login(credentials: LoginCredentials) {
  try {
    // Sanitizar entradas
    const sanitizedCredentials = {
      username: sanitizeInput(credentials.username) || '',
      password: credentials.password // No sanitizamos contraseñas
    };
    
    const response = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken() || ''
      },
      body: JSON.stringify(sanitizedCredentials)
    });
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Obtener información del usuario después del login exitoso
    const userResponse = await fetch(`${API_URL}/profile/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${data.access}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!userResponse.ok) {
      throw new Error(`Could not fetch user profile: ${userResponse.statusText}`);
    }
    
    const userData = await userResponse.json();
    
    // Guardar usuario y token en el store
    auth.login(userData, data.access);
    
    return { success: true, user: userData };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function register(userData: RegisterData) {
  try {
    // Sanitizar campos excepto contraseña
    const sanitizedData = {
      ...userData,
      username: sanitizeInput(userData.username) || '',
      email: sanitizeInput(userData.email) || '',
      first_name: userData.first_name ? sanitizeInput(userData.first_name) : undefined,
      last_name: userData.last_name ? sanitizeInput(userData.last_name) : undefined
    };
    
    const response = await fetch(`${API_URL}/register/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken() || ''
      },
      body: JSON.stringify(sanitizedData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function logout() {
  try {
    
    // Limpiar localmente - esto es lo importante
    auth.logout();
    
    // Limpiar cookies si las hay
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    // Incluso si hay error en API, limpiamos localmente
    auth.logout();
    return { success: true };
  }
}

export async function getProfile(): Promise<User> {
  let token: string | null = null;
  
  // Obtener token actual del store
  auth.subscribe(authState => {
    token = authState.token;
  })();
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  try {
    const response = await fetch(`${API_URL}/profile/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Could not fetch profile: ${response.statusText}`);
    }
    
    const userData = await response.json();
    
    // Actualizamos el store con los datos más recientes
    auth.updateUser(userData);
    
    return userData;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}