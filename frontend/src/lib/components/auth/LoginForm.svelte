
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import SecurityAlert from '$lib/components/task/SecurityAlert.svelte';
    import { language } from '$lib/stores/language';
    import { createTranslate } from '$lib/i18n/translations';
    import { login } from '../../../service/auth';
    
    export let redirectTo = '/';
  
    const dispatch = createEventDispatcher();
    
    $: t = createTranslate($language);
  
    let username = '';
    let password = '';
    let loading = false;
    let error: string | null = null;
    let submitAttempted = false;
  
    async function handleSubmit() {
      submitAttempted = true;
      
      if (username.trim() === '' || password === '') {
        return;
      }
      
      loading = true;
      error = null;
      
      try {
        const result = await login({ username, password });
        dispatch('login', result.user);
        
        // Redirigir después de un login exitoso
        setTimeout(() => goto(redirectTo), 500);
        
      } catch (err) {
        error = err instanceof Error ? err.message : 'Login failed';
      } finally {
        loading = false;
      }
    }
  </script>
  
  <form 
    on:submit|preventDefault={handleSubmit} 
    class="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100 max-w-md mx-auto"
    transition:fade={{ duration: 300 }}
  >
    <h2 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
      {t('login')}
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
  
    <div class="mb-4">
      <label for="username" class="block text-gray-700 font-medium mb-1">{t('username')}</label>
      <input
        type="text"
        id="username"
        bind:value={username}
        required
        disabled={loading}
        class="w-full px-3 py-2 border {submitAttempted && !username ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        placeholder={t('enterUsername')}
      />
      {#if submitAttempted && !username}
        <p class="text-red-500 text-xs mt-1">{t('usernameRequired')}</p>
      {/if}
    </div>
  
    <div class="mb-6">
      <label for="password" class="block text-gray-700 font-medium mb-1">{t('password')}</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        disabled={loading}
        class="w-full px-3 py-2 border {submitAttempted && !password ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        placeholder={t('enterPassword')}
      />
      {#if submitAttempted && !password}
        <p class="text-red-500 text-xs mt-1">{t('passwordRequired')}</p>
      {/if}
    </div>
  
    <div class="flex justify-between items-center">
      <button
        type="submit"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center"
        disabled={loading}
      >
        {#if loading}
          <span class="mr-2">
            <span class="animate-spin inline-block h-4 w-4 border-t-2 border-white rounded-full"></span>
          </span>
        {/if}
        {t('login')}
      </button>
      
      <a href="/auth/register" class="text-blue-500 hover:text-blue-700 text-sm">
        {t('register')}
      </a>
    </div>
  </form>