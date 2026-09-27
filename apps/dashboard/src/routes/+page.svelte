<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getAuth } from '$lib/auth.svelte';

	const auth = getAuth();

	onMount(() => {
		if (auth.isAuthenticated) {
			goto('/articles');
		} else {
			goto('/login');
		}
	});
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<div class="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900"></div>
</div>
