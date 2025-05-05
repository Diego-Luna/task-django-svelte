
<script lang="ts">
    import { fade } from 'svelte/transition';
    import { auth } from '$lib/stores/auth';
    import { language } from '$lib/stores/language';
    import { createTranslate } from '$lib/i18n/translations';
    import { escapeHtml } from '$lib/utils/security';
    import SecurityAlert from '$lib/components/task/SecurityAlert.svelte';
    
    $: t = createTranslate($language);
    $: user = $auth.user;
    $: isAuthenticated = $auth.isAuthenticated;
  
    let error: string | null = null;
  </script>
  
  {#if isAuthenticated && user}
    <div 
      class="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100 max-w-md mx-auto"
      transition:fade={{ duration: 300 }}
    >
      <h2 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
        {t('myAccount')}
      </h2>
      
      {#if error}
        <SecurityAlert 
          type="error" 
          message={error} 
          dismissable={true} 
          autoDismiss={true} 
          duration={5000} 
        />
      {/if}
      
      <div class="space-y-3">
        <div>
          <h3 class="text-sm text-gray-500">{t('username')}</h3>
          <p class="text-lg">{escapeHtml(user.username)}</p>
        </div>
        
        <div>
          <h3 class="text-sm text-gray-500">{t('email')}</h3>
          <p class="text-lg">{escapeHtml(user.email)}</p>
        </div>
        
        {#if user.first_name || user.last_name}
          <div>
            <h3 class="text-sm text-gray-500">{t('firstName')} / {t('lastName')}</h3>
            <p class="text-lg">
              {escapeHtml(user.first_name || '')} {escapeHtml(user.last_name || '')}
            </p>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div class="text-center py-10">
      <p class="text-lg text-gray-600">Please login to view your profile</p>
      <a 
        href="/auth/login" 
        class="mt-4 inline-block px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {t('login')}
      </a>
    </div>
  {/if}