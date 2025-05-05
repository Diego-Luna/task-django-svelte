<script lang="ts">
    import { language } from '$lib/stores/language';
    
    function setLanguage(lang: string) {
      language.set(lang);
    }
  </script>
  
  <div class="flex items-center gap-2">
    <button 
      class="px-2 py-1 rounded-md transition-all {$language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}"
      on:click={() => setLanguage('en')}
      aria-label="Switch to English"
    >
      🇺🇸 EN
    </button>
    
    <button 
      class="px-2 py-1 rounded-md transition-all {$language === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}"
      on:click={() => setLanguage('fr')}
      aria-label="Switch to French"
    >
      🇫🇷 FR
    </button>
  </div>