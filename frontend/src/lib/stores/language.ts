import { browser } from '$app/environment';
import { writable } from 'svelte/store';

// Get the saved language from localStorage or use 'en' by default
const storedLang = browser ? localStorage.getItem('language') || 'en' : 'en';

// Create a writable store with the initial value
export const language = writable<string>(storedLang);

// Subscribe to changes and save to localStorage
if (browser) {
  language.subscribe((value) => {
    localStorage.setItem('language', value);
  });
}