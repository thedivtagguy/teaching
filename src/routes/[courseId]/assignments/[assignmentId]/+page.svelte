<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import MDLayout from '$lib/components/MDLayout.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { Calendar, ArrowLeft, CheckCircle } from 'lucide-svelte';
	import { confetti } from '@neoconfetti/svelte';
	import { browser } from '$app/environment';

	// Get course ID and assignment ID from URL params
	$: courseId = $page.params.courseId;
	$: assignmentId = $page.params.assignmentId;

	// Get the assignment content from the page data
	$: assignment = $page.data?.assignment;
	$: loadError = $page.data?.error;
	$: loadedMeta = $page.data?.meta || {};

	// State for confetti
	let showConfetti = false;

	// Use the same approach as the listings page
	$: title = loadedMeta?.title || 'Assignment';
	$: due = loadedMeta?.due;
	$: description = loadedMeta?.description;
	$: points = loadedMeta?.points;

	// Track completion status using localStorage (same pattern as listings page)
	let isCompleted = false;

	// Generate assignment key (same pattern as listings page)
	function getAssignmentKey(): string {
		return `${courseId}_assignment_${title.replace(/\s+/g, '_')}`;
	}

	// Load completion status on mount
	onMount(() => {
		if (browser) {
			const key = getAssignmentKey();
			isCompleted = localStorage.getItem(key) === 'completed';
		}
	});

	// Update completion status when title changes
	$: if (browser && title) {
		const key = getAssignmentKey();
		isCompleted = localStorage.getItem(key) === 'completed';
	}

	function submitAssignment() {
		if (!browser) return;

		const key = getAssignmentKey();

		if (isCompleted) {
			// Mark as incomplete
			localStorage.removeItem(key);
			isCompleted = false;
		} else {
			// Mark as complete
			localStorage.setItem(key, 'completed');
			isCompleted = true;

			// Show confetti
			showConfetti = true;
			setTimeout(() => {
				showConfetti = false;
			}, 3000);
		}
	}
</script>

<SEO {title} {description} {courseId} contentType="assignment" date={due} />

<div class="mx-auto max-w-7xl">
	<!-- Back to course link -->
	<div class="mb-6">
		<a
			href="/{courseId}/assignments"
			class="text-primary hover:text-primary/80 inline-flex items-center transition-colors"
		>
			<ArrowLeft class="mr-2 h-4 w-4" />
			<span class="font-archivo">Back to assignments</span>
		</a>
	</div>

	{#if loadError}
		<div
			class="bg-destructive/10 border-destructive/20 text-destructive mb-6 rounded-lg border p-6"
		>
			<p class="font-archivo text-lg">{loadError}</p>
		</div>
	{:else if assignment}
		<div class="flex flex-col lg:flex-row">
			<!-- Main content area -->
			<div class="lg:max-w-3xl lg:flex-1">
				<!-- Assignment header -->
				<div class="mb-6">
					<h1 class="font-libre-caslon mb-3 text-3xl">{title}</h1>

					<div class="text-muted-foreground flex flex-wrap gap-4 text-sm">
						{#if due}
							<div class="flex items-center">
								<Calendar class="text-primary mr-1 h-4 w-4" />
								<span class="font-archivo"
									>Due: {due.includes('T')
										? new Date(due.split('T')[0] + 'T12:00:00.000Z').toLocaleDateString('en-US', {
												weekday: 'long',
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})
										: due}</span
								>
							</div>
						{/if}

						{#if points}
							<div class="flex items-center">
								<span class="font-archivo">Points: {points}</span>
							</div>
						{/if}

						{#if isCompleted}
							<div class="flex items-center">
								<CheckCircle class="text-secondary mr-1 h-4 w-4" />
								<span class="font-archivo">Completed</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Assignment description -->
				{#if description}
					<div class="bg-primary/50 mb-4 flex w-fit items-center rounded-md p-2">
						<p class="font-archivo text-muted-foreground !mb-0">{description}</p>
					</div>
				{/if}

				<!-- Main assignment content -->
				<MDLayout
					metadata={assignment.metadata || {}}
					{courseId}
					fileName={assignmentId}
					fileType="assignment"
				>
					<svelte:component this={assignment} />
				</MDLayout>
			</div>

			<!-- Right sidebar with submission status -->
			<div class="lg:w-64 lg:self-start lg:pl-8">
				<div class="bg-card border-border relative overflow-hidden rounded-sm border-1 shadow-xs">
					<!-- Header -->
					<div class="bg-primary/10 border-border border-b px-4 py-3">
						<h3 class="font-libre-caslon text-lg font-semibold">Assignment Status</h3>
					</div>

					<!-- Status content -->
					<div class="space-y-4 p-4">
						<!-- Current Status -->
						<div class="flex items-center justify-between">
							<span class="font-archivo text-muted-foreground text-sm font-medium">Status</span>
							<div class="flex items-center gap-2">
								{#if isCompleted}
									<div class="flex items-center gap-2 rounded-md bg-green-500/10 p-1">
										<CheckCircle class="size-4 text-green-500" />
										<span class="font-archivo !text-sm font-semibold text-green-500">
											Completed
										</span>
									</div>
								{:else}
									<div class="border-muted-foreground h-4 w-4 rounded-full border-2"></div>
									<span class="font-archivo text-muted-foreground text-sm font-medium"
										>Not Started</span
									>
								{/if}
							</div>
						</div>

						<!-- Due Date -->
						{#if due}
							<div class="flex items-center justify-between">
								<span class="font-archivo text-muted-foreground text-sm font-medium">Due Date</span>
								<div class="flex items-center gap-2">
									<Calendar class="text-primary h-4 w-4" />
									<span class="font-archivo text-sm font-semibold"
										>{due.includes('T')
											? new Date(due.split('T')[0] + 'T12:00:00.000Z').toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric'
												})
											: due}</span
									>
								</div>
							</div>
						{/if}
					</div>

					<!-- Action button -->
					<div class="border-border border-t p-4">
						<button
							on:click={submitAssignment}
							class="bg-primary text-primary-foreground hover:bg-primary/90 border-primary font-archivo relative w-full transform rounded border-2 px-4 py-3 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
						>
							{isCompleted ? 'Mark as Unsubmitted' : 'Mark as Submitted'}
						</button>
					</div>

					<!-- Confetti for sidebar -->
					{#if showConfetti}
						<div
							use:confetti={{
								particleCount: 75,
								force: 0.7,
								stageWidth: 400,
								stageHeight: 300,
								duration: 3000,
								colors: ['#FFC700', '#FF0000', '#2E3191', '#41BBC7', '#00FF00']
							}}
							class="pointer-events-none absolute inset-0 z-50"
						></div>
					{/if}
				</div>
			</div>
		</div>
	{:else}
		<div class="bg-card flex h-32 items-center justify-center rounded-lg">
			<div class="text-muted-foreground font-archivo animate-pulse">Loading assignment...</div>
		</div>
	{/if}
</div>
