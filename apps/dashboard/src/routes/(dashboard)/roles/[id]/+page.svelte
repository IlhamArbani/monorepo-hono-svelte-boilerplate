<script lang="ts">
	import { api } from '$lib/api';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let role = $state<any>(null);
	let allPermissions = $state<any[]>([]);
	let loadingData = $state(true);
	let error = $state('');
	let saving = $state(false);

	let selectedPermissionIds = $state<string[]>([]);

	const roleId = $page.params.id;

	// Group permissions by module: { articles: [{ id, name, action }], ... }
	let groupedPermissions = $derived.by(() => {
		const groups: Record<string, { id: string; name: string; action: string; description?: string }[]> = {};

		for (const perm of allPermissions) {
			const parts = perm.name.split(':');
			const moduleName = parts.length > 1 ? parts[0] : 'other';
			const action = parts.length > 1 ? parts.slice(1).join(':') : perm.name;

			if (!groups[moduleName]) groups[moduleName] = [];
			groups[moduleName].push({ id: perm.id, name: perm.name, action, description: perm.description });
		}

		// Sort modules alphabetically
		return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
	});

	// Check if ALL permissions in a module are selected
	function isModuleFullySelected(perms: { id: string }[]) {
		return perms.every(p => selectedPermissionIds.includes(p.id));
	}

	// Check if SOME permissions in a module are selected
	function isModulePartiallySelected(perms: { id: string }[]) {
		const selected = perms.filter(p => selectedPermissionIds.includes(p.id));
		return selected.length > 0 && selected.length < perms.length;
	}

	function toggleModule(perms: { id: string }[]) {
		const allSelected = isModuleFullySelected(perms);
		if (allSelected) {
			// Unselect all in this module
			const permIds = new Set(perms.map(p => p.id));
			selectedPermissionIds = selectedPermissionIds.filter(id => !permIds.has(id));
		} else {
			// Select all in this module
			const current = new Set(selectedPermissionIds);
			for (const p of perms) current.add(p.id);
			selectedPermissionIds = [...current];
		}
	}

	function togglePermission(permId: string) {
		if (selectedPermissionIds.includes(permId)) {
			selectedPermissionIds = selectedPermissionIds.filter(id => id !== permId);
		} else {
			selectedPermissionIds = [...selectedPermissionIds, permId];
		}
	}

	function selectAll() {
		selectedPermissionIds = allPermissions.map(p => p.id);
	}

	function deselectAll() {
		selectedPermissionIds = [];
	}

	async function fetchData() {
		try {
			const [roleRes, permRes] = await Promise.all([
				api.get(`/roles/${roleId}`),
				api.get('/permissions')
			]);
			role = roleRes.data;
			allPermissions = permRes.data || [];

			selectedPermissionIds = role.rolePermissions?.map((rp: any) => rp.permission?.id || rp.permissionId).filter(Boolean) || [];
		} catch (err: any) {
			error = err.message;
		} finally {
			loadingData = false;
		}
	}

	async function handleSave() {
		saving = true;
		try {
			await api.post(`/roles/${roleId}/permissions`, { permissionIds: selectedPermissionIds });
			alert('Permissions updated!');
			await fetchData();
		} catch (err: any) {
			alert(err.message);
		} finally {
			saving = false;
		}
	}

	// Format action label nicely
	function formatAction(action: string) {
		return action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
	}

	function formatModule(mod: string) {
		return mod.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
	}

	onMount(() => fetchData());
</script>

<div class="mx-auto max-w-4xl space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
				Role Permissions
				{#if role}
					<span class="text-neutral-500 font-normal">— {role.name}</span>
				{/if}
			</h2>
			<p class="text-sm text-neutral-500 dark:text-neutral-400">Checklist permissions per module untuk role ini.</p>
		</div>
		<a href="/roles" class="inline-flex h-9 items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50">Back</a>
	</div>

	{#if error}
		<div class="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</div>
	{/if}

	{#if loadingData}
		<div class="flex h-64 items-center justify-center rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
			<div class="text-neutral-500">Loading...</div>
		</div>
	{:else if allPermissions.length === 0}
		<div class="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
			<p class="text-sm text-neutral-500">Belum ada permission. Buat permission terlebih dahulu di halaman <a href="/master-data/permissions" class="text-blue-600 underline hover:text-blue-800">Permissions</a>.</p>
		</div>
	{:else}
		<!-- Quick Actions -->
		<div class="flex items-center gap-3">
			<button onclick={selectAll} class="inline-flex items-center rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800">Select All</button>
			<button onclick={deselectAll} class="inline-flex items-center rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800">Deselect All</button>
			<span class="text-xs text-neutral-500">{selectedPermissionIds.length} / {allPermissions.length} selected</span>
		</div>

		<!-- Permission Groups by Module -->
		<div class="space-y-4">
			{#each groupedPermissions as [moduleName, perms]}
				<div class="rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
					<!-- Module Header with Select All toggle -->
					<div class="flex items-center gap-3 border-b border-neutral-200 px-5 py-3.5 dark:border-neutral-800">
						<input
							type="checkbox"
							checked={isModuleFullySelected(perms)}
							indeterminate={isModulePartiallySelected(perms)}
							onchange={() => toggleModule(perms)}
							class="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-950 dark:border-neutral-700"
						/>
						<span class="text-sm font-semibold text-neutral-900 dark:text-white">{formatModule(moduleName)}</span>
						<span class="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
							{perms.filter(p => selectedPermissionIds.includes(p.id)).length}/{perms.length}
						</span>
					</div>

					<!-- Action Checkboxes (horizontal row) -->
					<div class="flex flex-wrap gap-x-6 gap-y-2 px-5 py-3.5">
						{#each perms as perm}
							<label class="flex items-center gap-2 cursor-pointer group">
								<input
									type="checkbox"
									checked={selectedPermissionIds.includes(perm.id)}
									onchange={() => togglePermission(perm.id)}
									class="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-950 dark:border-neutral-700"
								/>
								<span class="text-sm text-neutral-700 group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-white">{formatAction(perm.action)}</span>
							</label>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<!-- Save Button -->
		<div class="flex justify-end pt-2">
			<button onclick={handleSave} disabled={saving} class="inline-flex items-center justify-center rounded-md bg-neutral-900 px-8 py-2.5 text-sm font-medium text-neutral-50 shadow hover:bg-neutral-900/90 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90">
				{saving ? 'Saving...' : 'Save Permissions'}
			</button>
		</div>
	{/if}
</div>
