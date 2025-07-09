<script lang="ts">
	import { page } from '$app/stores';
	import {
		Clipboard,
		Calendar,
		ExternalLink,
		Check,
		Clock,
		FileText,
		AlertTriangle
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fly, fade } from 'svelte/transition';
	import { confetti } from '@neoconfetti/svelte';

	// Type definitions
	interface AssignmentMeta {
		id: string;
		title: string;
		due?: string;
		description?: string;
		points?: number;
		path?: string;
		source?: string;
	}

	// Get course ID from URL params
	$: courseId = $page.params.courseId;

	// Get assignments from the page data
	$: allAssignments = ($page.data?.assignments || []) as AssignmentMeta[];

	// Process assignments to ensure they all have IDs
	$: processedAssignments = allAssignments.map((assignment) => {
		// If the assignment already has an ID, use it
		if (assignment.id) return assignment;

		// Otherwise create an ID from path or title
		let id = null;

		// Try to extract from path
		if (assignment.path) {
			const pathMatch = assignment.path.match(/\/([^\/]+)$/);
			if (pathMatch && pathMatch[1]) {
				id = pathMatch[1];
			}
		}

		// Fall back to using the title
		if (!id && assignment.title) {
			id = assignment.title.replace(/\s+/g, '_');
		}

		return {
			...assignment,
			id: id || 'unknown'
		};
	});

	// Keep track of completed assignments using localStorage - EXACT copy from readings
	let completedAssignments = new Set<string>();

	// Generate a unique key for each assignment - EXACT copy from readings
	function getAssignmentKey(assignment: AssignmentMeta): string {
		return `${courseId}_assignment_${assignment.title.replace(/\s+/g, '_')}`;
	}

	// Toggle assignment completion status - EXACT copy from readings
	function toggleAssignmentCompletion(assignment: AssignmentMeta) {
		const key = getAssignmentKey(assignment);

		if (completedAssignments.has(key)) {
			completedAssignments.delete(key);
			localStorage.setItem(key, '');
			localStorage.removeItem(key);
		} else {
			completedAssignments.add(key);
			localStorage.setItem(key, 'completed');

			// Trigger confetti for this specific assignment
			confettiForAssignment = assignment.id;
			setTimeout(() => (confettiForAssignment = null), 3000);
		}

		// Use simpler approach to trigger reactivity - just assign to itself
		completedAssignments = completedAssignments;
	}

	// Load saved assignment states on mount - EXACT copy from readings
	onMount(() => {
		// Batch localStorage operations
		for (const assignment of processedAssignments) {
			const key = getAssignmentKey(assignment);
			if (localStorage.getItem(key) === 'completed') {
				completedAssignments.add(key);
			}
		}

		// Trigger reactivity once
		completedAssignments = completedAssignments;
	});

	// Track progress stats reactively
	$: completedCount = processedAssignments.filter(assignment => completedAssignments.has(getAssignmentKey(assignment))).length;
	$: progressPercentage = totalAssignments > 0 ? Math.round((completedCount / totalAssignments) * 100) : 0;

	// Confetti state
	let confettiForAssignment: string | null = null;

	// Make totalAssignments reactive
	$: totalAssignments = processedAssignments.length;

	// Group assignments by due date
	$: assignmentsByDue = groupAssignmentsByDueDate(processedAssignments);

	// Sort the due dates
	$: sortedDueDates = Object.keys(assignmentsByDue).sort((a, b) => {
		if (a === 'No Due Date') return 1;
		if (b === 'No Due Date') return -1;
		return new Date(b).getTime() - new Date(a).getTime();
	});

	// Group assignments by due date
	function groupAssignmentsByDueDate(
		assignments: AssignmentMeta[]
	): Record<string, AssignmentMeta[]> {
		return assignments.reduce(
			(groups: Record<string, AssignmentMeta[]>, assignment: AssignmentMeta) => {
				const due = assignment.due || 'No Due Date';
				if (!groups[due]) {
					groups[due] = [];
				}
				groups[due].push(assignment);
				return groups;
			},
			{}
		);
	}

	// Check if assignment is past due
	function isPastDue(dueDate: string): boolean {
		if (dueDate === 'No Due Date') return false;

		// If all assignments for this date are completed, don't mark as past due
		const assignmentsForDate = assignmentsByDue[dueDate] || [];
		const allCompleted =
			assignmentsForDate.length > 0 &&
			assignmentsForDate.every((assignment) => completedAssignments.has(getAssignmentKey(assignment)));

		if (allCompleted) return false;

		const now = new Date();
		const due = new Date(dueDate);
		due.setHours(21, 0, 0, 0); // Set to 9:00 PM
		return now > due;
	}

	// Format date for display
	function formatDate(dateString: string): string {
		if (dateString === 'No Due Date') return dateString;
		return new Date(dateString).toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Assignments | {courseId.toUpperCase()}</title>
	<meta name="description" content="Course assignments for {courseId.toUpperCase()}" />
</svelte:head>

<div class="noise-image mx-auto max-w-4xl px-4 pb-16 md:px-0">
	<!-- Header with progress indicator -->
	<div class="border-foreground mb-8 border-b-2 pb-6">
		<div class="flex flex-col justify-between gap-2 md:flex-row md:items-end">
			<div class="flex flex-col">
				<h1 class="font-libre-caslon text-foreground m-0 flex items-center p-0 text-4xl">
					Assignments
				</h1>
				<p class="text-muted-foreground font-archivo m-0 p-0 text-lg">
					All assignments for {courseId.toUpperCase()}.
				</p>
			</div>

			<!-- Progress indicator -->
			{#if totalAssignments > 0}
				<div class="bg-muted border-foreground btn-drop-shadow rounded-lg border-2 p-3">
					<div class="flex flex-col items-center gap-1">
						<div class="text-right">
							<p class="font-archivo text-foreground text-sm font-bold uppercase">
								Progress ({completedCount}/{totalAssignments})
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
								class="font-archivo absolute {completedCount === totalAssignments
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

	{#if sortedDueDates.length === 0}
		<div class="bg-muted border-foreground btn-drop-shadow rounded-lg border-2 p-8 text-center">
			<p class="text-foreground font-archivo font-bold">
				No assignments have been added to this course yet.
			</p>
			<a
				href="/{courseId}"
				class="bg-primary hover:bg-primary/80 font-roboto border-foreground btn-drop-shadow text-primary-foreground mt-6 inline-block rounded-md border-2 px-6 py-2 font-bold uppercase transition-colors"
			>
				Return to Course
			</a>
		</div>
	{:else}
		<!-- Assignment List grouped by due date -->
		<div class="space-y-8">
			{#each sortedDueDates as dueDate, index}
				<div
					in:fly={{ y: 20, duration: 300, delay: index * 100 }}
					class="bg-card border-foreground btn-drop-shadow overflow-hidden rounded-lg border-2"
				>
					<div class=" border-foreground border-b-2 px-6">
						<h2 class="font-roboto text-foreground py-4 text-xl font-bold tracking-wide">
							{formatDate(dueDate)}
						</h2>
					</div>

					<ul class="divide-muted-foreground divide-y">
						{#each assignmentsByDue[dueDate] as assignment, assIndex}
							<!-- Apply a subtle background when assignment is completed -->
							<li
								in:fade={{ duration: 300, delay: assIndex * 50 }}
								class={`group relative p-6 transition-all duration-300 ${
									completedAssignments.has(getAssignmentKey(assignment))
										? 'bg-green bg-opacity-10  border-foreground border-y'
										: 'hover:bg-muted'
								}`}
							>
								<div class="flex flex-col justify-between gap-4 md:flex-row md:items-start">
									<div class="flex-1">
										<h3
											class="font-roboto text-foreground text-md mb-1 flex items-center gap-2 font-bold"
										>
											<span
												class={completedAssignments.has(getAssignmentKey(assignment))
													? 'text-secondary-foreground'
													: 'text-foreground'}
											>
												{assignment.title}
											</span>
										</h3>

										{#if assignment.description}
											<span
												class="text-foreground font-archivo mt-1 block text-sm font-normal italic opacity-75"
												>{assignment.description}</span
											>
										{/if}

										<div
											class="font-archivo mt-3 flex flex-wrap items-center gap-4 text-sm"
											class:text-secondary-foreground={completedAssignments.has(getAssignmentKey(assignment))}
											class:text-foreground={!completedAssignments.has(getAssignmentKey(assignment))}
										>
											{#if assignment.points}
												<span class="flex items-center gap-1">
													<FileText class="h-4 w-4" />
													<span>{assignment.points} points</span>
												</span>
											{/if}

											{#if assignment.due && assignment.due !== 'No Due Date'}
												<span class="flex items-center gap-1">
													<Clock class="h-4 w-4" />
													<span>Due {formatDate(assignment.due)}</span>
												</span>
											{/if}

											{#if assignment.path}
												<a
													href={assignment.path}
													class="{completedAssignments.has(getAssignmentKey(assignment))
														? 'text-foreground'
														: 'text-primary'} hover:text-primary/80 flex items-center font-bold underline underline-offset-2 hover:no-underline"
												>
													<span>View Details</span>
												</a>
											{/if}
										</div>
									</div>

									<div class="mt-1 flex flex-wrap gap-2 md:mt-0">
										<button
											on:click={() => toggleAssignmentCompletion(assignment)}
											class={`flex transform items-center gap-2 rounded-sm px-4 py-2 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 ${
												completedAssignments.has(getAssignmentKey(assignment))
													? 'border-foreground text-secondary-foreground border-2 bg-green-800/30 shadow-inner'
													: 'bg-muted text-foreground hover:bg-green border-foreground hover:text-secondary-foreground border-2'
											}`}
											aria-label={completedAssignments.has(getAssignmentKey(assignment))
												? 'Mark as incomplete'
												: 'Mark as complete'}
										>
											{#if completedAssignments.has(getAssignmentKey(assignment))}
												<Check class="h-5 w-5" />
											{/if}
											<span class="font-archivo text-sm font-bold"
												>{completedAssignments.has(getAssignmentKey(assignment)) ? 'Completed' : 'Mark complete'}</span
											>
										</button>

										{#if assignment.path}
											<a
												href={assignment.path}
												class="bg-primary hover:bg-primary/80 border-foreground btn-drop-shadow text-primary-foreground flex transform items-center gap-2 rounded-xs border-2 px-4 py-2 transition-all hover:-translate-y-1 active:translate-y-0"
												aria-label="View assignment details"
											>
												<ExternalLink class="h-5 w-5" />
												<span class="font-archivo text-sm font-bold">View</span>
											</a>
										{/if}
									</div>
								</div>

								<!-- Confetti -->
								{#if confettiForAssignment === assignment.id}
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
