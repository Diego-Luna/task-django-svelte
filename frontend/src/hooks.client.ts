import { browser } from '$app/environment';
import { language } from '$lib/stores/language';

// Actualizar el atributo lang del HTML cuando cambia el idioma
if (browser) {
  language.subscribe((lang) => {
    document.documentElement.lang = lang;
  });
}