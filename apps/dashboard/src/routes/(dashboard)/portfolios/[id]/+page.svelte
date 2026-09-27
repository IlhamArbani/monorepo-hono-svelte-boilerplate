<script lang="ts">
	import { api } from '$lib/api';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import TiptapEditor from '$lib/components/TiptapEditor.svelte';

	let loading = $state(false);
	let loadingData = $state(true);
	let error = $state('');

	let status = $state('draft');
	let coverImage = $state('');

	let enTitle = $state('');
	let enDescription = $state('');
	let enContent = $state('');

	let idTitle = $state('');
	let idDescription = $state('');
	let idContent = $state('');

	let currentTab = $state('en');

	const portfolioId = $page.params.id;

	onMount(async () => {
		try {
			const res = await api.get(`/portfolios/${portfolioId}`);
			const item = res.data;

			status = item.status || 'draft';
			coverImage = item.coverImage || '';

			const en = item.translations?.find((t: any) => t.locale === 'en');
			if (en) { enTitle = en.title || ''; enDescription = en.description || ''; enContent = en.content || ''; }

			const id = item.translations?.find((t: any) => t.locale === 'id');
			if (id) { idTitle = id.title || ''; idDescription = id.description || ''; idContent = id.content || ''; }
		} catch (err: any) {
			error = err.message || 'Failed to load portfolio';
		} finally {
			loadingData = false;
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		const translations = [];
		if (enTitle) translations.push({ locale: 'en', title: enTitle, description: enDescription || undefined, content: enContent });
		if (idTitle) translations.push({ locale: 'id', title: idTitle, description: idDescription || undefined, content: idContent });

		const payload = {
			status,
			coverImage: coverImage || undefined,
			translations
		};

		try {
			await api.put(`/portfolios/${portfolioId}`, payload);
			goto('/portfolios');
		} catch (err: any) {
			error = err.message || 'Failed to update portfolio';
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto max-w-4xl space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Edit Portfolio</h2>
			<p class="text-sm text-neutral-500 dark:text-neutral-400">Update your multi-language portfolio project.</p>
		</div>
		<a href="/portfolios" class="inline-flex h-9 items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50">Cancel</a>
	</div>

	{#if error}
		<div class="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</div>
	{/if}

	{#if loadingData}
		<div class="flex h-64 items-center justify-center rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
			<div class="text-neutral-500">Loading portfolio...</div>
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="space-y-8">
			<!-- Settings -->
			<div class="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
				<h3 class="mb-4 text-lg font-medium text-neutral-900 dark:text-white">Settings</h3>
				<div class="grid gap-6 md:grid-cols-2">
					<div class="space-y-2">
						<label for="status" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Status</label>
						<select id="status" bind:value={status} class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300">
							<option value="draft">Draft</option>
							<option value="publish">Publish</option>
						</select>
					</div>
					<div class="space-y-2">
						<label for="coverImage" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Cover Image URL</label>
						<input type="url" id="coverImage" bind:value={coverImage} class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300" placeholder="https://..." />
					</div>
				</div>
			</div>

			<!-- Translations -->
			<div class="rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
				<div class="flex border-b border-neutral-200 dark:border-neutral-800">
					<button type="button" onclick={() => currentTab = 'en'} class="px-6 py-3 text-sm font-medium transition-colors {currentTab === 'en' ? 'border-b-2 border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'}">English</button>
					<button type="button" onclick={() => currentTab = 'id'} class="px-6 py-3 text-sm font-medium transition-colors {currentTab === 'id' ? 'border-b-2 border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'}">Bahasa Indonesia</button>
				</div>

				<div class="p-6">
					<div class="space-y-6" class:hidden={currentTab !== 'en'}>
						<div class="space-y-2">
							<label for="enTitle" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Title (EN)</label>
							<input type="text" id="enTitle" bind:value={enTitle} class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300" />
						</div>
						<div class="space-y-2">
							<label for="enDescription" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Description (EN)</label>
							<textarea id="enDescription" bind:value={enDescription} rows="3" class="flex w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300"></textarea>
						</div>
						<div class="space-y-2">
							<label for="enContent" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Content (EN)</label>
							<TiptapEditor bind:value={enContent} placeholder="Write the English content here..." />
						</div>
					</div>

					<div class="space-y-6" class:hidden={currentTab !== 'id'}>
						<div class="space-y-2">
							<label for="idTitle" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Title (ID)</label>
							<input type="text" id="idTitle" bind:value={idTitle} class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300" />
						</div>
						<div class="space-y-2">
							<label for="idDescription" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Description (ID)</label>
							<textarea id="idDescription" bind:value={idDescription} rows="3" class="flex w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300"></textarea>
						</div>
						<div class="space-y-2">
							<label for="idContent" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Content (ID)</label>
							<TiptapEditor bind:value={idContent} placeholder="Tulis konten dalam Bahasa Indonesia di sini..." />
						</div>
					</div>
				</div>
			</div>

			<div class="flex justify-end">
				<button type="submit" disabled={loading} class="inline-flex items-center justify-center rounded-md bg-neutral-900 px-8 py-2.5 text-sm font-medium text-neutral-50 shadow hover:bg-neutral-900/90 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90">
					{loading ? 'Saving...' : 'Update Portfolio'}
				</button>
			</div>
		</form>
	{/if}
</div>
