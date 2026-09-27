<script lang="ts">
	import { api } from '$lib/api';
	import { getAuth } from '$lib/auth.svelte';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let errorMessage = $state('');

	const auth = getAuth();

	async function handleLogin(e: Event) {
		e.preventDefault();
		loading = true;
		errorMessage = '';

		try {
			const res = await api.post('/auth/login', { email, password });
			if (res.data && res.data.token) {
				// We don't get full user object from login yet, but we get token
				auth.setAuth(res.data.token, { id: 'temp', name: 'User', email });
				
				// Fetch real user info
				try {
					const me = await api.get('/auth/me');
					auth.setUser(me.data);
				} catch (err) {
					console.error("Failed to fetch user profile", err);
				}
				
				goto('/articles');
			} else {
				errorMessage = 'Invalid response from server';
			}
		} catch (err: any) {
			errorMessage = err.message || 'Login failed';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-neutral-100 dark:bg-neutral-900">
	<div class="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold text-neutral-900 dark:text-white">CMS Login</h1>
			<p class="text-sm text-neutral-500 dark:text-neutral-400">Enter your credentials to access the dashboard</p>
		</div>

		{#if errorMessage}
			<div class="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
				{errorMessage}
			</div>
		{/if}

		<form onsubmit={handleLogin} class="space-y-4">
			<div>
				<label for="email" class="mb-2 block text-sm font-medium text-neutral-900 dark:text-white">Email</label>
				<input
					type="email"
					id="email"
					bind:value={email}
					required
					class="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:focus:border-neutral-300 dark:focus:ring-neutral-300"
					placeholder="admin@example.com"
				/>
			</div>

			<div>
				<label for="password" class="mb-2 block text-sm font-medium text-neutral-900 dark:text-white">Password</label>
				<input
					type="password"
					id="password"
					bind:value={password}
					required
					class="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:focus:border-neutral-300 dark:focus:ring-neutral-300"
					placeholder="••••••••"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
			>
				{loading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>
	</div>
</div>
