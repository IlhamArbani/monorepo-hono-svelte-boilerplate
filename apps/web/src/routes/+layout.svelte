<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import SiteHeader from '../components/SiteHeader.svelte';
	import SiteFooter from '../components/SiteFooter.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>


<div class="relative z-10 min-h-screen flex flex-col">
  <SiteHeader />
  <main class="flex-1">
    {@render children()}
  </main>
  <SiteFooter />
</div>

