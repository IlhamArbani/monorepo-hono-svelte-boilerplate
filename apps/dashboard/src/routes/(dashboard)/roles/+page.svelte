<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';

	let roles = $state<any[]>([]);
	let loading = $state(true);

	let showForm = $state(false);
	let editingId = $state<string | null>(null);
	let formName = $state('');
	let formDescription = $state('');
	let saving = $state(false);

	async function fetchRoles() {
		try {
			loading = true;
			const res = await api.get('/roles');
			roles = res.data || [];
		} catch (err: any) {
			alert(err.message);
		} finally {
			loading = false;
		}
	}

	function openCreate() { editingId = null; formName = ''; formDescription = ''; showForm = true; }
	function openEdit(item: any) { editingId = item.id; formName = item.name; formDescription = item.description || ''; showForm = true; }
	function closeForm() { showForm = false; editingId = null; }

	async function handleSubmit(e: Event) {
		e.preventDefault();
		saving = true;
		try {
			const payload = { name: formName, description: formDescription || undefined };
			if (editingId) { await api.put(`/roles/${editingId}`, payload); }
			else { await api.post('/roles', payload); }
			closeForm();
			await fetchRoles();
		} catch (err: any) {
			alert(err.message);
		} finally {
			saving = false;
		}
	}

	async function deleteRole(id: string) {
		if (!confirm('Are you sure?')) return;
		try { await api.delete(`/roles/${id}`); await fetchRoles(); } catch (err: any) { alert(err.message); }
	}

	onMount(() => fetchRoles());
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Roles</h2>
			<p class="text-sm text-neutral-500 dark:text-neutral-400">Manage roles and permission assignments.</p>
		</div>
		<button onclick={openCreate} class="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
			Add Role
		</button>
	</div>

	{#if showForm}
		<div class="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
			<h3 class="mb-4 text-lg font-medium text-neutral-900 dark:text-white">{editingId ? 'Edit' : 'Create'} Role</h3>
			<form onsubmit={handleSubmit} class="space-y-4">
				<div class="space-y-2">
					<label for="name" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Name *</label>
					<input type="text" id="name" bind:value={formName} required class="flex h-10 w-full max-w-md rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300" placeholder="e.g. admin, editor" />
				</div>
				<div class="space-y-2">
					<label for="description" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Description</label>
					<textarea id="description" bind:value={formDescription} rows="2" class="flex w-full max-w-md rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300"></textarea>
				</div>
				<div class="flex gap-2">
					<button type="submit" disabled={saving} class="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-50 shadow hover:bg-neutral-900/90 disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90">{saving ? 'Saving...' : 'Save'}</button>
					<button type="button" onclick={closeForm} class="inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800">Cancel</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
		<div class="relative w-full overflow-auto">
			<table class="w-full caption-bottom text-sm">
				<thead class="[&_tr]:border-b [&_tr]:border-neutral-200 dark:[&_tr]:border-neutral-800">
					<tr>
						<th class="h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400">Name</th>
						<th class="h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400">Description</th>
						<th class="h-12 px-4 text-right align-middle font-medium text-neutral-500 dark:text-neutral-400">Actions</th>
					</tr>
				</thead>
				<tbody class="[&_tr:last-child]:border-0">
					{#if loading}
						<tr><td colspan="3" class="p-4 text-center text-neutral-500">Loading...</td></tr>
					{:else if roles.length === 0}
						<tr><td colspan="3" class="p-4 text-center text-neutral-500">No roles found.</td></tr>
					{:else}
						{#each roles as role}
							<tr class="border-b border-neutral-200 transition-colors hover:bg-neutral-100/50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
								<td class="p-4 align-middle font-medium">{role.name}</td>
								<td class="p-4 align-middle text-neutral-500">{role.description || '-'}</td>
								<td class="p-4 align-middle text-right">
									<div class="flex justify-end gap-2">
										<a href={`/roles/${role.id}`} class="inline-flex h-8 items-center rounded-md border border-neutral-200 bg-white px-3 text-xs font-medium shadow-sm hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800">Permissions</a>
										<button onclick={() => openEdit(role)} class="inline-flex h-8 items-center rounded-md border border-neutral-200 bg-white px-3 text-xs font-medium shadow-sm hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800">Edit</button>
										<button onclick={() => deleteRole(role.id)} class="inline-flex h-8 items-center rounded-md border border-neutral-200 bg-white px-3 text-xs font-medium text-red-600 shadow-sm hover:bg-red-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-red-500 dark:hover:bg-red-950/50">Delete</button>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
