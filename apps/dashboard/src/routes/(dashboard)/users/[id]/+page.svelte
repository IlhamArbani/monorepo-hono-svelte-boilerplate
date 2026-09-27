<script lang="ts">
	import { api } from '$lib/api';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let user = $state<any>(null);
	let allRoles = $state<any[]>([]);
	let loadingData = $state(true);
	let error = $state('');
	let saving = $state(false);

	// Edit user form
	let formName = $state('');
	let formEmail = $state('');

	// Role assignment
	let selectedRoleIds = $state<string[]>([]);

	const userId = $page.params.id;

	async function fetchData() {
		try {
			const [userRes, rolesRes] = await Promise.all([
				api.get(`/users/${userId}`),
				api.get('/roles')
			]);
			user = userRes.data;
			allRoles = rolesRes.data || [];

			formName = user.name;
			formEmail = user.email;
			selectedRoleIds = user.userRoles?.map((ur: any) => ur.role?.id || ur.roleId).filter(Boolean) || [];
		} catch (err: any) {
			error = err.message;
		} finally {
			loadingData = false;
		}
	}

	async function handleUpdateUser(e: Event) {
		e.preventDefault();
		saving = true;
		try {
			await api.put(`/users/${userId}`, { name: formName, email: formEmail });
			alert('User updated!');
		} catch (err: any) {
			alert(err.message);
		} finally {
			saving = false;
		}
	}

	async function handleAssignRoles() {
		saving = true;
		try {
			await api.post(`/users/${userId}/roles`, { roleIds: selectedRoleIds });
			alert('Roles updated!');
			await fetchData();
		} catch (err: any) {
			alert(err.message);
		} finally {
			saving = false;
		}
	}

	function toggleRole(roleId: string) {
		if (selectedRoleIds.includes(roleId)) {
			selectedRoleIds = selectedRoleIds.filter(id => id !== roleId);
		} else {
			selectedRoleIds = [...selectedRoleIds, roleId];
		}
	}

	onMount(() => fetchData());
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Manage User</h2>
			<p class="text-sm text-neutral-500 dark:text-neutral-400">Edit user info and manage role assignments.</p>
		</div>
		<a href="/users" class="inline-flex h-9 items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50">Back</a>
	</div>

	{#if error}
		<div class="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</div>
	{/if}

	{#if loadingData}
		<div class="flex h-64 items-center justify-center rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
			<div class="text-neutral-500">Loading user...</div>
		</div>
	{:else}
		<!-- User Info -->
		<div class="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
			<h3 class="mb-4 text-lg font-medium text-neutral-900 dark:text-white">User Information</h3>
			<form onsubmit={handleUpdateUser} class="space-y-4">
				<div class="grid gap-6 md:grid-cols-2">
					<div class="space-y-2">
						<label for="name" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Name</label>
						<input type="text" id="name" bind:value={formName} required class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300" />
					</div>
					<div class="space-y-2">
						<label for="email" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
						<input type="email" id="email" bind:value={formEmail} required class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300" />
					</div>
				</div>
				<button type="submit" disabled={saving} class="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-50 shadow hover:bg-neutral-900/90 disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90">{saving ? 'Saving...' : 'Update User'}</button>
			</form>
		</div>

		<!-- Role Assignment -->
		<div class="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
			<h3 class="mb-4 text-lg font-medium text-neutral-900 dark:text-white">Assigned Roles</h3>
			{#if allRoles.length === 0}
				<p class="text-sm text-neutral-500">No roles available. Create roles first.</p>
			{:else}
				<div class="space-y-3 mb-4">
					{#each allRoles as role}
						<label class="flex items-center gap-3 rounded-md border border-neutral-200 px-4 py-3 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900 cursor-pointer">
							<input type="checkbox" checked={selectedRoleIds.includes(role.id)} onchange={() => toggleRole(role.id)} class="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-950 dark:border-neutral-700" />
							<div>
								<span class="text-sm font-medium text-neutral-900 dark:text-white">{role.name}</span>
								{#if role.description}
									<p class="text-xs text-neutral-500">{role.description}</p>
								{/if}
							</div>
						</label>
					{/each}
				</div>
				<button onclick={handleAssignRoles} disabled={saving} class="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-50 shadow hover:bg-neutral-900/90 disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90">{saving ? 'Saving...' : 'Save Roles'}</button>
			{/if}
		</div>
	{/if}
</div>
