<script lang="ts">
	import { page } from '$app/stores';
	import { BookOpen, ExternalLink, Check, BookOpenCheck, Clock, FileText } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { confetti } from '@neoconfetti/svelte';
	import { fly, fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

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
	let confettiForReading: string | null = null;

	// Highlight state for anchor navigation
	let highlightedSection: string | null = null;

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

			// Trigger confetti for this specific reading
			confettiForReading = reading.title;
			setTimeout(() => (confettiForReading = null), 3000);
		}

		// Use simpler approach to trigger reactivity - just assign to itself
		completedReadings = completedReadings;
	}

	// Generate anchor ID from source name
	function generateAnchorId(source: string): string {
		return source.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
	}

	// Handle day link clicks
	function handleDayClick(source: string) {
		if (!browser) return;
		const anchorId = generateAnchorId(source);
		const url = new URL(window.location.href);
		url.searchParams.set('day', anchorId);
		goto(url.toString(), { replaceState: true });
		// Highlight the section
		highlightedSection = anchorId;
		// Remove highlight after 2 seconds
		setTimeout(() => {
			highlightedSection = null;
		}, 2000);
	}

	// Scroll to anchor on page load
	function scrollToAnchor() {
		if (!browser) return;
		const urlParams = new URLSearchParams(window.location.search);
		const dayParam = urlParams.get('day');
		if (dayParam) {
			setTimeout(() => {
				const element = document.getElementById(dayParam);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth', block: 'start' });
					// Highlight the section
					highlightedSection = dayParam;
					// Remove highlight after 2 seconds
					setTimeout(() => {
						highlightedSection = null;
					}, 2000);
				}
			}, 100);
		}
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

		// Scroll to anchor if present in URL
		scrollToAnchor();
	});
</script>

<svelte:head>
	<title>Readings | {courseId.toUpperCase()}</title>
	<meta name="description" content="Course readings for {courseId.toUpperCase()}" />
</svelte:head>

<div class="noise-image mx-auto max-w-4xl px-4 pb-16 md:px-0">
	<!-- Header with progress indicator -->
	<div class="border-foreground mb-8 border-b-2 pb-6">
		<div class="flex flex-col justify-between gap-2 md:flex-row md:items-end">
			<div class="flex flex-col">
				<h1 class="font-libre-caslon text-foreground m-0 flex items-center p-0 text-4xl">
					Readings
				</h1>
				<p class="text-muted-foreground font-archivo m-0 p-0 text-lg">
					All required and recommended readings for {courseId.toUpperCase()}.
				</p>
			</div>

			<!-- Progress indicator -->
			{#if totalReadings > 0}
				<div class="bg-muted border-foreground btn-drop-shadow rounded-lg border-2 p-3">
					<div class="flex flex-col items-center gap-1">
						<div class="text-right">
							<p class="font-archivo text-foreground text-sm font-bold uppercase">
								Progress ({completedCount}/{totalReadings})
							</p>
						</div>
						<div
							class="bg-card border-foreground flex h-8 w-full items-center justify-start overflow-hidden rounded-full border-2"
						>
							<div
								class="bg-green h-full transition-all duration-500 ease-out"
								style="width: {progressPercentage}%"
							></div>
							<p
								class="font-archivo absolute {completedCount === totalReadings
									? 'text-secondary-foreground'
									: 'text-foreground'} mt-4 ml-2 text-right font-bold"
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
		<div class="bg-muted border-foreground btn-drop-shadow rounded-lg border-2 p-8 text-center">
			<p class="text-foreground font-archivo font-bold">
				No readings have been assigned for this course yet.
			</p>
			<a
				href="/{courseId}"
				class="bg-primary hover:bg-primary/80 font-roboto border-foreground btn-drop-shadow text-primary-foreground mt-6 inline-block rounded-md border-2 px-6 py-2 font-bold uppercase transition-colors"
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
					class="bg-card border-foreground btn-drop-shadow overflow-hidden rounded-lg border-2"
					id={generateAnchorId(source)}
				>
					<div class=" border-foreground border-b-2 px-6 py-4 transition-all duration-500 {highlightedSection === generateAnchorId(source) ? 'bg-yellow-300' : ''}">
						<button
							on:click={() => handleDayClick(source)}
							class="font-roboto text-foreground text-lg font-bold tracking-wide uppercase hover:text-primary transition-colors cursor-pointer text-left w-full"
							aria-label="Link to {source}"
						>
							{source}
						</button>
					</div>

					<ul class="divide-muted-foreground divide-y">
						{#each readings as reading, readingIndex}
							<!-- Apply a subtle background when reading is completed -->
							<li
								in:fade={{ duration: 300, delay: readingIndex * 50 }}
								class={`group relative p-6 transition-all duration-300 ${
									completedReadings.has(getReadingKey(reading))
										? 'bg-green bg-opacity-10  border-foreground border-y'
										: 'hover:bg-muted'
								}`}
							>
								<div class="flex flex-col justify-between gap-4 md:flex-row md:items-start">
									<div class="flex-1">
										<h3 class="font-roboto text-foreground mb-1 flex items-center gap-2 font-bold">
											<span
												class={completedReadings.has(getReadingKey(reading))
													? 'text-secondary-foreground'
													: 'text-foreground'}
											>
												{reading.title}
											</span>
										</h3>

										{#if reading.author}
											<span
												class="text-foreground font-archivo mt-1 block text-sm font-normal italic opacity-75"
												>by {reading.author}</span
											>
										{/if}

										<div
											class="font-archivo mt-3 flex flex-wrap items-center gap-4 text-sm"
											class:text-secondary-foreground={completedReadings.has(
												getReadingKey(reading)
											)}
											class:text-foreground={!completedReadings.has(getReadingKey(reading))}
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
														? 'text-foreground'
														: 'text-primary'} hover:text-primary/80 flex items-center font-bold underline underline-offset-2 hover:no-underline"
												>
													<span>{reading.path}</span>
												</a>
											{/if}
										</div>
									</div>

									<div class="mt-1 flex flex-wrap gap-2 md:mt-0">
										<button
											on:click={() => toggleReadingCompletion(reading)}
											class={`flex transform items-center gap-2 rounded-sm px-4 py-2 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 ${
												completedReadings.has(getReadingKey(reading))
													? 'border-foreground text-secondary-foreground border-2 bg-green-800/30 shadow-inner'
													: 'bg-muted text-foreground hover:bg-green border-foreground hover:text-secondary-foreground border-2'
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
												class="bg-primary hover:bg-primary/80 border-foreground text-primary-foreground flex transform items-center gap-2 rounded-xs border-2 px-4 py-2 transition-all hover:-translate-y-1 active:translate-y-0"
												aria-label="Open reading resource"
											>
												<ExternalLink class="h-5 w-5" />
												<span class="font-archivo text-sm font-bold">Open</span>
											</a>
										{/if}
									</div>
								</div>

								<!-- Confetti -->
								{#if confettiForReading === reading.title}
									<div
										use:confetti={{
											particleCount: 75,
											force: 0.7,
											stageWidth: 800,
											stageHeight: 400,
											duration: 3000,
											colors: [
												'#FFC700',
												'#FF0000', 
												'#2E3191',
												'#41BBC7',
												'#00FF00'
											]
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
