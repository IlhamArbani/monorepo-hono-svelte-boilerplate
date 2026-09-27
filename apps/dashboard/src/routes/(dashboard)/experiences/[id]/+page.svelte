<script lang="ts">
	import { api } from '$lib/api';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let loading = $state(false);
	let loadingData = $state(true);
	let error = $state('');

	// Main fields
	let organization = $state('');
	let location = $state('');
	let locationType = $state('onsite');
	let employmentType = $state('full_time');
	let startMonth = $state(1);
	let startYear = $state(new Date().getFullYear());
	let endMonth = $state<number | undefined>(undefined);
	let endYear = $state<number | undefined>(undefined);
	let isCurrentlyWork = $state(false);

	// Translations
	let enJobTitle = $state('');
	let enHighlights = $state('');
	let idJobTitle = $state('');
	let idHighlights = $state('');

	let currentTab = $state('en');

	const experienceId = $page.params.id;

	const months = [
		{ value: 1, label: 'January' }, { value: 2, label: 'February' },
		{ value: 3, label: 'March' }, { value: 4, label: 'April' },
		{ value: 5, label: 'May' }, { value: 6, label: 'June' },
		{ value: 7, label: 'July' }, { value: 8, label: 'August' },
		{ value: 9, label: 'September' }, { value: 10, label: 'October' },
		{ value: 11, label: 'November' }, { value: 12, label: 'December' },
	];

	onMount(async () => {
		try {
			const res = await api.get(`/experiences/${experienceId}`);
			const item = res.data;

			organization = item.organization || '';
			location = item.location || '';
			locationType = item.locationType || 'onsite';
			employmentType = item.employmentType || 'full_time';
			startMonth = item.startMonth || 1;
			startYear = item.startYear || new Date().getFullYear();
			endMonth = item.endMonth || undefined;
			endYear = item.endYear || undefined;
			isCurrentlyWork = item.isCurrentlyWork || false;

			const en = item.translations?.find((t: any) => t.locale === 'en');
			if (en) { enJobTitle = en.jobTitle || ''; enHighlights = en.highlights || ''; }

			const id = item.translations?.find((t: any) => t.locale === 'id');
			if (id) { idJobTitle = id.jobTitle || ''; idHighlights = id.highlights || ''; }
		} catch (err: any) {
			error = err.message || 'Failed to load experience';
		} finally {
			loadingData = false;
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		const translations = [];
		if (enJobTitle) translations.push({ locale: 'en', jobTitle: enJobTitle, highlights: enHighlights || undefined });
		if (idJobTitle) translations.push({ locale: 'id', jobTitle: idJobTitle, highlights: idHighlights || undefined });

		const payload: any = {
			organization,
			location: location || undefined,
			locationType,
			employmentType,
			startMonth,
			startYear,
			isCurrentlyWork,
			translations
		};

		if (!isCurrentlyWork) {
			payload.endMonth = endMonth;
			payload.endYear = endYear;
		}

		try {
			await api.put(`/experiences/${experienceId}`, payload);
			goto('/experiences');
		} catch (err: any) {
			error = err.message || 'Failed to update experience';
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto max-w-4xl space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Edit Experience</h2>
			<p class="text-sm text-neutral-500 dark:text-neutral-400">Update your work experience entry.</p>
		</div>
		<a href="/experiences" class="inline-flex h-9 items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50">Cancel</a>
	</div>

	{#if error}
		<div class="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</div>
	{/if}

	{#if loadingData}
		<div class="flex h-64 items-center justify-center rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
			<div class="text-neutral-500">Loading experience...</div>
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="space-y-8">
			<!-- Organization Details -->
			<div class="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
				<h3 class="mb-4 text-lg font-medium text-neutral-900 dark:text-white">Organization Details</h3>
				<div class="grid gap-6 md:grid-cols-2">
					<div class="space-y-2">
						<label for="organization" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Organization *</label>
						<input type="text" id="organization" bind:value={organization} required class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300" placeholder="Company name" />
					</div>
					<div class="space-y-2">
						<label for="location" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Location</label>
						<input type="text" id="location" bind:value={location} class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300" placeholder="Jakarta, Indonesia" />
					</div>
					<div class="space-y-2">
						<label for="locationType" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Location Type</label>
						<select id="locationType" bind:value={locationType} class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300">
							<option value="onsite">Onsite</option>
							<option value="remote">Remote</option>
							<option value="hybrid">Hybrid</option>
						</select>
					</div>
					<div class="space-y-2">
						<label for="employmentType" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Employment Type</label>
						<select id="employmentType" bind:value={employmentType} class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300">
							<option value="full_time">Full Time</option>
							<option value="part_time">Part Time</option>
							<option value="contract">Contract</option>
							<option value="freelance">Freelance</option>
							<option value="internship">Internship</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Duration -->
			<div class="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
				<h3 class="mb-4 text-lg font-medium text-neutral-900 dark:text-white">Duration</h3>
				<div class="mb-4 flex items-center gap-2">
					<input type="checkbox" id="isCurrentlyWork" bind:checked={isCurrentlyWork} class="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-950 dark:border-neutral-700" />
					<label for="isCurrentlyWork" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">I currently work here</label>
				</div>
				<div class="grid gap-6 md:grid-cols-2">
					<div class="space-y-2">
						<label for="startMonth" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Start Month *</label>
						<select id="startMonth" bind:value={startMonth} class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300">
							{#each months as m}
								<option value={m.value}>{m.label}</option>
							{/each}
						</select>
					</div>
					<div class="space-y-2">
						<label for="startYear" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Start Year *</label>
						<input type="number" id="startYear" bind:value={startYear} min="1950" max="2099" required class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300" />
					</div>
					{#if !isCurrentlyWork}
						<div class="space-y-2">
							<label for="endMonth" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">End Month</label>
							<select id="endMonth" bind:value={endMonth} class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300">
								<option value={undefined}>-</option>
								{#each months as m}
									<option value={m.value}>{m.label}</option>
								{/each}
							</select>
						</div>
						<div class="space-y-2">
							<label for="endYear" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">End Year</label>
							<input type="number" id="endYear" bind:value={endYear} min="1950" max="2099" class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300" />
						</div>
					{/if}
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
							<label for="enJobTitle" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Job Title (EN) *</label>
							<input type="text" id="enJobTitle" bind:value={enJobTitle} class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300" placeholder="Software Engineer" />
						</div>
						<div class="space-y-2">
							<label for="enHighlights" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Highlights (EN)</label>
							<textarea id="enHighlights" bind:value={enHighlights} rows="6" class="flex w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300" placeholder="Key achievements and responsibilities..."></textarea>
						</div>
					</div>

					<div class="space-y-6" class:hidden={currentTab !== 'id'}>
						<div class="space-y-2">
							<label for="idJobTitle" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Job Title (ID) *</label>
							<input type="text" id="idJobTitle" bind:value={idJobTitle} class="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300" placeholder="Software Engineer" />
						</div>
						<div class="space-y-2">
							<label for="idHighlights" class="text-sm font-medium leading-none text-neutral-700 dark:text-neutral-300">Highlights (ID)</label>
							<textarea id="idHighlights" bind:value={idHighlights} rows="6" class="flex w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300" placeholder="Pencapaian utama dan tanggung jawab..."></textarea>
						</div>
					</div>
				</div>
			</div>

			<div class="flex justify-end">
				<button type="submit" disabled={loading} class="inline-flex items-center justify-center rounded-md bg-neutral-900 px-8 py-2.5 text-sm font-medium text-neutral-50 shadow hover:bg-neutral-900/90 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90">
					{loading ? 'Saving...' : 'Update Experience'}
				</button>
			</div>
		</form>
	{/if}
</div>
