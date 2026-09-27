<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';

	let users = $state<any[]>([]);
	let loading = $state(true);

	async function fetchUsers() {
		try {
			loading = true;
			const res = await api.get('/users');
			users = res.data || [];
		} catch (err: any) {
			alert(err.message);
		} finally {
			loading = false;
		}
	}

	async function deleteUser(id: string) {
		if (!confirm('Are you sure you want to delete this user?')) return;
		try { await api.delete(`/users/${id}`); await fetchUsers(); } catch (err: any) { alert(err.message); }
	}

	onMount(() => fetchUsers());
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Users</h2>
			<p class="text-sm text-neutral-500 dark:text-neutral-400">Manage user accounts and role assignments.</p>
		</div>
	</div>

	<div class="rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
		<div class="relative w-full overflow-auto">
			<table class="w-full caption-bottom text-sm">
				<thead class="[&_tr]:border-b [&_tr]:border-neutral-200 dark:[&_tr]:border-neutral-800">
					<tr>
						<th class="h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400">Name</th>
						<th class="h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400">Email</th>
						<th class="h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400">Roles</th>
						<th class="h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400">Created</th>
						<th class="h-12 px-4 text-right align-middle font-medium text-neutral-500 dark:text-neutral-400">Actions</th>
					</tr>
				</thead>
				<tbody class="[&_tr:last-child]:border-0">
					{#if loading}
						<tr><td colspan="5" class="p-4 text-center text-neutral-500">Loading...</td></tr>
					{:else if users.length === 0}
						<tr><td colspan="5" class="p-4 text-center text-neutral-500">No users found.</td></tr>
					{:else}
						{#each users as user}
							<tr class="border-b border-neutral-200 transition-colors hover:bg-neutral-100/50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
								<td class="p-4 align-middle font-medium">{user.name}</td>
								<td class="p-4 align-middle text-neutral-500">{user.email}</td>
								<td class="p-4 align-middle">
									<div class="flex flex-wrap gap-1">
										{#if user.userRoles?.length}
											{#each user.userRoles as ur}
												<span class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold text-neutral-950 dark:text-neutral-50">{ur.role?.name || 'unknown'}</span>
											{/each}
										{:else}
											<span class="text-xs text-neutral-400">No roles</span>
										{/if}
									</div>
								</td>
								<td class="p-4 align-middle text-neutral-500">{new Date(user.createdAt).toLocaleDateString()}</td>
								<td class="p-4 align-middle text-right">
									<div class="flex justify-end gap-2">
										<a href={`/users/${user.id}`} class="inline-flex h-8 items-center rounded-md border border-neutral-200 bg-white px-3 text-xs font-medium shadow-sm hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800">Manage</a>
										<button onclick={() => deleteUser(user.id)} class="inline-flex h-8 items-center rounded-md border border-neutral-200 bg-white px-3 text-xs font-medium text-red-600 shadow-sm hover:bg-red-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-red-500 dark:hover:bg-red-950/50">Delete</button>
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
