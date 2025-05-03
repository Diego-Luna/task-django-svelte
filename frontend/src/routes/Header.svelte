<script lang="ts">
    import { page } from '$app/state';
    import logo from '$lib/images/svelte-logo.svg';
    import github from '$lib/images/github.svg';
</script>

<header>
    <div class="corner">
        <a href="/">
            <img src={logo} alt="SvelteKit" />
        </a>
    </div>

    <nav>
        <ul>
            <li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
                <a href="/">Home</a>
            </li>
            <li aria-current={page.url.pathname.startsWith('/tasks') ? 'page' : undefined}>
                <a href="/tasks">Tasks</a>
            </li>
            <li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
                <a href="/about">About</a>
            </li>
            <li aria-current={page.url.pathname.startsWith('/sverdle') ? 'page' : undefined}>
                <a href="/sverdle">Sverdle</a>
            </li>
        </ul>
    </nav>

</header>