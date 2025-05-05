import { browser } from '$app/environment';
import { writable } from 'svelte/store';

// Obtener el idioma guardado de localStorage o usar 'en' por defecto
const storedLang = browser ? localStorage.getItem('language') || 'en' : 'en';

// Crear un store writable con el valor inicial
export const language = writable<string>(storedLang);

// Suscribirse a los cambios y guardar en localStorage
if (browser) {
  language.subscribe((value) => {
    localStorage.setItem('language', value);
  });
}