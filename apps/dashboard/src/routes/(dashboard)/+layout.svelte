<script lang="ts">
	import { getAuth } from '$lib/auth.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let { children } = $props();
	const auth = getAuth();
	
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		if (!auth.isAuthenticated) {
			goto('/login');
		}
	});

	const navItems = [
		{ name: 'Articles', href: '/articles', icon: 'file-text' },
		{ name: 'Portfolios', href: '/portfolios', icon: 'briefcase' },
		{ name: 'Experiences', href: '/experiences', icon: 'award' },
		{ name: 'Categories', href: '/master-data/categories', icon: 'folder' },
		{ name: 'Skills', href: '/master-data/skills', icon: 'zap' },
		{ name: 'Users', href: '/users', icon: 'users' },
		{ name: 'Roles', href: '/roles', icon: 'shield' },
		{ name: 'Permissions', href: '/master-data/permissions', icon: 'key' }
	];
</script>

{#if mounted && auth.isAuthenticated}
	<div class="flex min-h-screen bg-neutral-100 dark:bg-neutral-950">
		<!-- Sidebar -->
		<aside class="fixed inset-y-0 left-0 w-64 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
			<div class="flex h-16 items-center border-b border-neutral-200 px-6 dark:border-neutral-800">
				<span class="text-lg font-bold text-neutral-900 dark:text-white">CMS Dashboard</span>
			</div>
			
			<nav class="p-4 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors {$page.url.pathname.startsWith(item.href) ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white'}"
					>
						{item.name}
					</a>
				{/each}
			</nav>

			<div class="absolute bottom-0 left-0 w-full border-t border-neutral-200 p-4 dark:border-neutral-800">
				<div class="flex items-center gap-3 px-3 py-2">
					<div class="flex-1 overflow-hidden">
						<p class="truncate text-sm font-medium text-neutral-900 dark:text-white">{auth.user?.name || 'User'}</p>
						<p class="truncate text-xs text-neutral-500 dark:text-neutral-400">{auth.user?.email || ''}</p>
					</div>
				</div>
				<button
					onclick={() => auth.logout()}
					class="mt-2 w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-950/50"
				>
					Sign Out
				</button>
			</div>
		</aside>

		<!-- Main Content -->
		<div class="ml-64 flex flex-1 flex-col">
			<header class="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-8 dark:border-neutral-800 dark:bg-neutral-950">
				<h1 class="text-lg font-semibold text-neutral-900 dark:text-white">
					{navItems.find(i => $page.url.pathname.startsWith(i.href))?.name || 'Dashboard'}
				</h1>
			</header>
			
			<main class="flex-1 overflow-auto p-8">
				{@render children()}
			</main>
		</div>
	</div>
{/if}
