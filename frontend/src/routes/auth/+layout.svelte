<script lang="ts">
    import { fade } from 'svelte/transition';
    import { language } from '$lib/stores/language';
    import { createTranslate } from '$lib/i18n/translations';
    
    $: t = createTranslate($language);
</script>

<div class="container mx-auto px-4 py-8" in:fade={{duration: 300}}>
    <div class="max-w-md mx-auto">
        <slot />
    </div>
</div>