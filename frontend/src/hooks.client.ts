import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { language } from '$lib/stores/language';
import { isSafeUrl } from '$lib/utils/security';
import type { HandleClientError } from '@sveltejs/kit';

// Actualizar el atributo lang del HTML cuando cambia el idioma
if (browser) {
  language.subscribe((lang) => {
    document.documentElement.lang = lang;
  });
  
  // Proteger contra ataques de manipulación de URL
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    
    if (link && link.href) {
      // Verificar si la URL es segura
      if (!isSafeUrl(link.href)) {
        event.preventDefault();
        console.warn('Enlace potencialmente peligroso bloqueado:', link.href);
      }
    }
  });
}

// Manejar errores del cliente de forma segura
export const handleError: HandleClientError = ({ error, event }) => {
  console.error('Application error:', error);
  
  // No mostrar detalles específicos del error al usuario
  const message = 'Ocurrió un error inesperado';
  
  return {
    message
  };
};