
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Valor inicial intentando recuperar del localStorage
const storedAuthString = browser ? localStorage.getItem('auth') : null;
const initialState: AuthState = storedAuthString 
  ? JSON.parse(storedAuthString) 
  : { isAuthenticated: false, user: null, token: null };

// Crear el store
const authStore = writable<AuthState>(initialState);

// Funciones para manipular el estado de autenticación
export const auth = {
  ...authStore,
  login: (user: User, token: string) => {
    const authState: AuthState = {
      isAuthenticated: true,
      user,
      token
    };
    authStore.set(authState);
    
    if (browser) {
      localStorage.setItem('auth', JSON.stringify(authState));
    }
  },
  logout: () => {
    const authState: AuthState = {
      isAuthenticated: false,
      user: null,
      token: null
    };
    authStore.set(authState);
    
    if (browser) {
      localStorage.removeItem('auth');
    }
  },
  updateUser: (user: User) => {
    authStore.update(state => ({
      ...state,
      user
    }));
    
    if (browser) {
      const currentAuth = JSON.parse(localStorage.getItem('auth') || '{}');
      localStorage.setItem('auth', JSON.stringify({
        ...currentAuth,
        user
      }));
    }
  }
};