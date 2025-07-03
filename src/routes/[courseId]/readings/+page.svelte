<script lang="ts">
	import { page } from '$app/stores';
	import { BookOpen, ExternalLink, Check, BookOpenCheck, Clock, FileText } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { confetti } from '@neoconfetti/svelte';
	import { fly, fade } from 'svelte/transition';

	// Interface definitions
	interface Reading {
		title: string;
		author?: string;
		pages?: string;
		url?: string;
		source?: string;
		path?: string;
		readingTime?: string;
	}

	// Get course ID from URL params
	$: courseId = $page.params.courseId;

	// Get readings from the server
	$: allReadings = ($page.data?.readings || []) as Reading[];

	// Group readings by source (which day or section)
	$: readingGroups = groupReadingsBySource(allReadings);

	// Calculate overall progress
	$: totalReadings = allReadings.length;
	$: completedCount = allReadings.filter((reading) =>
		completedReadings.has(getReadingKey(reading))
	).length;
	$: progressPercentage =
		totalReadings > 0 ? Math.round((completedCount / totalReadings) * 100) : 0;

	// Confetti state
	let showConfetti = false;
	let confettiElement: HTMLElement;

	// Reading to show confetti for
	let confettiForReading: Reading | null = null;

	// Function to group readings by source
	function groupReadingsBySource(readings: Reading[]): Record<string, Reading[]> {
		return readings.reduce((groups: Record<string, Reading[]>, reading: Reading) => {
			const source = reading.source || 'General';
			if (!groups[source]) {
				groups[source] = [];
			}
			groups[source].push(reading);
			return groups;
		}, {});
	}

	// Keep track of completed readings using localStorage
	let completedReadings = new Set<string>();

	// Generate a unique key for each reading
	function getReadingKey(reading: Reading): string {
		return `${courseId}_reading_${reading.title.replace(/\s+/g, '_')}`;
	}

	// Toggle reading completion status
	function toggleReadingCompletion(reading: Reading) {
		const key = getReadingKey(reading);

		if (completedReadings.has(key)) {
			completedReadings.delete(key);
			localStorage.setItem(key, '');
			localStorage.removeItem(key);
		} else {
			completedReadings.add(key);
			localStorage.setItem(key, 'completed');

			// Show confetti for this specific reading
			confettiForReading = reading;
			setTimeout(() => (confettiForReading = null), 3000);
		}

		// Use simpler approach to trigger reactivity - just assign to itself
		completedReadings = completedReadings;
	}

	// Load saved reading states on mount - optimize localStorage checks
	onMount(() => {
		// Batch localStorage operations
		for (const reading of allReadings) {
			const key = getReadingKey(reading);
			if (localStorage.getItem(key) === 'completed') {
				completedReadings.add(key);
			}
		}

		// Trigger reactivity once
		completedReadings = completedReadings;
	});
</script>

<svelte:head>
	<title>Readings | {courseId.toUpperCase()}</title>
	<meta name="description" content="Course readings for {courseId.toUpperCase()}" />
</svelte:head>

<div class="noise-image mx-auto max-w-4xl px-4 pb-16 md:px-0">
	<!-- Header with progress indicator -->
	<div class="border-neutral mb-8 border-b-2 pb-6">
		<div class="flex flex-col justify-between gap-2 md:flex-row md:items-end">
			<div class="flex flex-col">
				<h1 class="font-libre-caslon text-neutral m-0 flex items-center p-0 text-4xl">Readings</h1>
				<p class="text-base-300 font-archivo m-0 p-0 text-lg">
					All required and recommended readings for {courseId.toUpperCase()}.
				</p>
			</div>

			<!-- Progress indicator -->
			{#if totalReadings > 0}
				<div class="bg-base-200 border-neutral btn-drop-shadow rounded-lg border-2 p-3">
					<div class="flex flex-col items-center gap-1">
						<div class="text-right">
							<p class="font-archivo text-neutral text-sm font-bold uppercase">
								Progress ({completedCount}/{totalReadings})
							</p>
						</div>
						<div
							class="bg-base-100 border-neutral flex h-8 w-full items-center justify-start overflow-hidden rounded-full border-2"
						>
							<div
								class="bg-sage h-full transition-all duration-500 ease-out"
								style="width: {progressPercentage}%"
							></div>
							<p
								class="font-archivo absolute {completedCount === totalReadings
									? 'text-sage-700'
									: 'text-neutral'} mt-4 ml-2 text-right font-bold"
								style="color: {completedCount === totalReadings ? 'var(--sage)' : 'var(--neutral)'}"
							>
								{progressPercentage}%
							</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	{#if Object.keys(readingGroups).length === 0}
		<div class="bg-base-200 border-neutral btn-drop-shadow rounded-lg border-2 p-8 text-center">
			<p class="text-neutral font-archivo font-bold">
				No readings have been assigned for this course yet.
			</p>
			<a
				href="/{courseId}"
				class="bg-blue hover:bg-purple font-roboto border-neutral btn-drop-shadow mt-6 inline-block rounded-md border-2 px-6 py-2 font-bold text-white uppercase transition-colors"
			>
				Return to Course
			</a>
		</div>
	{:else}
		<!-- Reading List -->
		<div class="space-y-8">
			{#each Object.entries(readingGroups) as [source, readings], index}
				<div
					in:fly={{ y: 20, duration: 300, delay: index * 100 }}
					class="bg-base-100 border-neutral btn-drop-shadow overflow-hidden rounded-lg border-2"
				>
					<div class=" border-neutral border-b-2 px-6">
						<h2 class="font-roboto text-neutral text-lg font-bold tracking-wide uppercase">
							{source}
						</h2>
					</div>

					<ul class="divide-base-300 divide-y">
						{#each readings as reading, readingIndex}
							<!-- Apply a subtle background when reading is completed -->
							<li
								in:fade={{ duration: 300, delay: readingIndex * 50 }}
								class={`group relative p-6 transition-all duration-300 ${
									completedReadings.has(getReadingKey(reading))
										? 'bg-sage bg-opacity-10  border-y border-black'
										: 'hover:bg-base-200'
								}`}
							>
								<div class="flex flex-col justify-between gap-4 md:flex-row md:items-start">
									<div class="flex-1">
										<h3 class="font-roboto text-neutral mb-1 flex items-center gap-2 font-bold">
											<span
												class={completedReadings.has(getReadingKey(reading))
													? 'text-sage-800'
													: 'text-neutral'}
											>
												{reading.title}
											</span>
										</h3>

										{#if reading.author}
											<span
												class="text-neutral font-archivo mt-1 block text-sm font-normal italic opacity-75"
												>by {reading.author}</span
											>
										{/if}

										<div
											class="font-archivo mt-3 flex flex-wrap items-center gap-4 text-sm"
											class:text-sage-700={completedReadings.has(getReadingKey(reading))}
											class:text-neutral={!completedReadings.has(getReadingKey(reading))}
										>
											{#if reading.pages}
												<span class="flex items-center gap-1">
													<FileText class="h-4 w-4" />
													<span>{reading.pages} pages</span>
												</span>
											{/if}

											{#if reading.readingTime}
												<span class="flex items-center gap-1">
													<Clock class="h-4 w-4" />
													<span>{reading.readingTime} min</span>
												</span>
											{/if}

											{#if reading.path}
												<a
													href={reading.path}
													class="{completedReadings.has(getReadingKey(reading))
														? 'text-neutral'
														: 'text-blue'} hover:text-purple flex items-center font-bold underline underline-offset-2 hover:no-underline"
												>
													<span>{reading.path}</span>
												</a>
											{/if}
										</div>
									</div>

									<div class="mt-1 flex flex-wrap gap-2 md:mt-0">
										<button
											on:click={() => toggleReadingCompletion(reading)}
											class={`flex transform items-center gap-2 rounded-md px-4 py-2 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 ${
												completedReadings.has(getReadingKey(reading))
													? 'bg-sage border-neutral border-2 text-white shadow-inner'
													: 'bg-base-200 text-neutral hover:bg-sage border-neutral border-2 hover:text-white'
											}`}
											aria-label={completedReadings.has(getReadingKey(reading))
												? 'Mark as unread'
												: 'Mark as read'}
										>
											{#if completedReadings.has(getReadingKey(reading))}
												<Check class="h-5 w-5" />
											{/if}
											<span class="font-archivo text-sm font-bold"
												>{completedReadings.has(getReadingKey(reading))
													? 'Completed'
													: 'Mark read'}</span
											>
										</button>

										{#if reading.url}
											<a
												href={reading.url}
												target="_blank"
												rel="noopener noreferrer"
												class="bg-blue hover:bg-purple border-neutral btn-drop-shadow flex transform items-center gap-2 rounded-md border-2 px-4 py-2 text-white transition-all hover:-translate-y-1 active:translate-y-0"
												aria-label="Open reading resource"
											>
												<ExternalLink class="h-5 w-5" />
												<span class="font-archivo text-sm font-bold">Open</span>
											</a>
										{/if}
									</div>
								</div>

								<!-- Reading-specific confetti -->
								{#if confettiForReading && confettiForReading.title === reading.title}
									<div
										use:confetti={{
											particleCount: 75,
											force: 0.7,
											stageWidth: 800,
											stageHeight: 400,
											colors: ['#E8C85A', '#E8845A', '#4D80E6', '#92DE86', '#949B80']
										}}
										class="pointer-events-none absolute inset-0 z-10"
									></div>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	li {
		margin: 0;
	}
</style>
