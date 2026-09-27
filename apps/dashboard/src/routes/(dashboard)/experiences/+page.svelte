<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';
	
	let experiences = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');

	async function fetchExperiences() {
		try {
			loading = true;
			const res = await api.get('/experiences');
			experiences = res.data || [];
		} catch (err: any) {
			error = err.message || 'Failed to load experiences';
		} finally {
			loading = false;
		}
	}

	async function deleteExperience(id: string) {
		if (!confirm('Are you sure you want to delete this experience?')) return;
		
		try {
			await api.delete(`/experiences/${id}`);
			await fetchExperiences();
		} catch (err: any) {
			alert('Failed to delete: ' + err.message);
		}
	}

	onMount(() => {
		fetchExperiences();
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Experiences</h2>
			<p class="text-sm text-neutral-500 dark:text-neutral-400">Manage your work history and experiences.</p>
		</div>
		<a
			href="/experiences/create"
			class="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-50 shadow hover:bg-neutral-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 dark:focus-visible:ring-neutral-300"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
			Create Experience
		</a>
	</div>

	{#if error}
		<div class="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
			{error}
		</div>
	{/if}

	<div class="rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
		<div class="relative w-full overflow-auto">
			<table class="w-full caption-bottom text-sm">
				<thead class="[&_tr]:border-b [&_tr]:border-neutral-200 dark:[&_tr]:border-neutral-800">
					<tr class="border-b border-neutral-200 transition-colors hover:bg-neutral-100/50 data-[state=selected]:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800/50 dark:data-[state=selected]:bg-neutral-800">
						<th class="h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400">Job Title (EN)</th>
						<th class="h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400">Organization</th>
						<th class="h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400">Period</th>
						<th class="h-12 px-4 text-right align-middle font-medium text-neutral-500 dark:text-neutral-400">Actions</th>
					</tr>
				</thead>
				<tbody class="[&_tr:last-child]:border-0">
					{#if loading}
						<tr>
							<td colspan="4" class="p-4 text-center text-neutral-500">Loading experiences...</td>
						</tr>
					{:else if experiences.length === 0}
						<tr>
							<td colspan="4" class="p-4 text-center text-neutral-500">No experiences found.</td>
						</tr>
					{:else}
						{#each experiences as item}
							<tr class="border-b border-neutral-200 transition-colors hover:bg-neutral-100/50 data-[state=selected]:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800/50 dark:data-[state=selected]:bg-neutral-800">
								<td class="p-4 align-middle font-medium">
									{item.translations?.find((t: any) => t.locale === 'en')?.jobTitle || 'Untitled'}
								</td>
								<td class="p-4 align-middle">{item.organization}</td>
								<td class="p-4 align-middle">
									{new Date(item.startDate).toLocaleDateString()} - 
									{item.isCurrent ? 'Present' : item.endDate ? new Date(item.endDate).toLocaleDateString() : '?'}
								</td>
								<td class="p-4 align-middle text-right">
									<div class="flex justify-end gap-2">
										<a
											href={`/experiences/${item.id}`}
											class="inline-flex h-8 items-center justify-center rounded-md border border-neutral-200 bg-white px-3 text-xs font-medium shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
										>
											Edit
										</a>
										<button
											onclick={() => deleteExperience(item.id)}
											class="inline-flex h-8 items-center justify-center rounded-md border border-neutral-200 bg-white px-3 text-xs font-medium text-red-600 shadow-sm hover:bg-red-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-red-500 dark:hover:bg-red-950/50"
										>
											Delete
										</button>
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
