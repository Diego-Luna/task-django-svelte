import { browser } from '$app/environment';

/**
 * Sanitiza la entrada del usuario para prevenir XSS
 */
export function sanitizeInput(input: string | null | undefined): string | null {
  if (!input) return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/on\w+=/gi, ''); // Elimina atributos de evento inline
}

/**
 * Valida la entrada del formulario de tareas
 */
export function validateTaskInput(title: string | undefined | null, description: string | null | undefined): { 
  valid: boolean; 
  errors: string[] 
} {
  const errors: string[] = [];
  
  // Validar título
  if (!title || title.trim() === '') {
    errors.push('El título es obligatorio');
  } else if (title.length > 200) {
    errors.push('El título debe tener menos de 200 caracteres');
  } else if (/[<>]/.test(title)) {
    errors.push('El título contiene caracteres no permitidos');
  }
  
  // Validar descripción si se proporciona
  if (description && description.length > 1000) {
    errors.push('La descripción debe tener menos de 1000 caracteres');
  } else if (description && /[<>]/.test(description)) {
    errors.push('La descripción contiene caracteres no permitidos');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Obtiene el token CSRF de las cookies
 */
export function getCSRFToken(): string | null {
  if (!browser) return null;
  
  const match = document.cookie.match(new RegExp('(^| )csrftoken=([^;]+)'));
  return match ? match[2] : null;
}

/**
 * Verifica si una URL es segura (para prevenir redirecciones maliciosas)
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsedUrl = new URL(url, window.location.origin);
    // Solo permitir URLs en el mismo origen o URLs absolutas específicas que conozcamos
    return parsedUrl.origin === window.location.origin || /^https:\/\/(svelte\.dev|kit\.svelte\.dev)/.test(parsedUrl.origin);
  } catch (e) {
    // Si la URL no es válida, asumimos que es relativa y segura
    return !url.includes(':') && !url.includes('//');
  }
}

/**
 * Escapa HTML para prevenir XSS cuando se muestra contenido dinámico
 */
export function escapeHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}