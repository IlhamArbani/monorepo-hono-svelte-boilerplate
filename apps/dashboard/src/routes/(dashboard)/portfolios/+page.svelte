<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';
	
	let portfolios = $state<any[]>([]);
	let loading = $state(true);
	let error = $state('');

	async function fetchPortfolios() {
		try {
			loading = true;
			const res = await api.get('/portfolios');
			portfolios = res.data || [];
		} catch (err: any) {
			error = err.message || 'Failed to load portfolios';
		} finally {
			loading = false;
		}
	}

	async function deletePortfolio(id: string) {
		if (!confirm('Are you sure you want to delete this portfolio?')) return;
		
		try {
			await api.delete(`/portfolios/${id}`);
			await fetchPortfolios();
		} catch (err: any) {
			alert('Failed to delete: ' + err.message);
		}
	}

	onMount(() => {
		fetchPortfolios();
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Portfolios</h2>
			<p class="text-sm text-neutral-500 dark:text-neutral-400">Manage your portfolio projects.</p>
		</div>
		<a
			href="/portfolios/create"
			class="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-50 shadow hover:bg-neutral-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 dark:focus-visible:ring-neutral-300"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
			Create Portfolio
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
						<th class="h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400">Title (EN)</th>
						<th class="h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400">Status</th>
						<th class="h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400">Link</th>
						<th class="h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400">Author</th>
						<th class="h-12 px-4 text-right align-middle font-medium text-neutral-500 dark:text-neutral-400">Actions</th>
					</tr>
				</thead>
				<tbody class="[&_tr:last-child]:border-0">
					{#if loading}
						<tr>
							<td colspan="5" class="p-4 text-center text-neutral-500">Loading portfolios...</td>
						</tr>
					{:else if portfolios.length === 0}
						<tr>
							<td colspan="5" class="p-4 text-center text-neutral-500">No portfolios found.</td>
						</tr>
					{:else}
						{#each portfolios as item}
							<tr class="border-b border-neutral-200 transition-colors hover:bg-neutral-100/50 data-[state=selected]:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800/50 dark:data-[state=selected]:bg-neutral-800">
								<td class="p-4 align-middle">
									{item.translations?.find((t: any) => t.locale === 'en')?.title || 'Untitled'}
								</td>
								<td class="p-4 align-middle">
									<div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:focus:ring-neutral-300 {item.status === 'publish' ? 'border-transparent bg-neutral-900 text-neutral-50 hover:bg-neutral-900/80 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/80' : 'text-neutral-950 dark:text-neutral-50'}">
										{item.status}
									</div>
								</td>
								<td class="p-4 align-middle">
									{#if item.link}
										<a href={item.link} target="_blank" class="text-blue-600 hover:underline">Link</a>
									{:else}
										-
									{/if}
								</td>
								<td class="p-4 align-middle">{item.author?.name || '-'}</td>
								<td class="p-4 align-middle text-right">
									<div class="flex justify-end gap-2">
										<a
											href={`/portfolios/${item.id}`}
											class="inline-flex h-8 items-center justify-center rounded-md border border-neutral-200 bg-white px-3 text-xs font-medium shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
										>
											Edit
										</a>
										<button
											onclick={() => deletePortfolio(item.id)}
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
