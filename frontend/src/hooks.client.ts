import { browser } from '$app/environment';
import { language } from '$lib/stores/language';

// Update the HTML language attribute when the language changes
if (browser) {
  language.subscribe((lang) => {
    document.documentElement.lang = lang;
  });
}