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
	import {
		assignmentStore,
		type AssignmentMeta,
		type AssignmentWithStatus
	} from '$lib/stores/assignments';
	import { browser } from '$app/environment';
	import { fly, fade } from 'svelte/transition';
	import { confetti } from '@neoconfetti/svelte';

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

	// Initialize the store on mount
	onMount(() => {
		if (browser) {
			// Initialize the store for this course
			assignmentStore.initCourse(courseId);

			// Add assignment metadata to the store
			assignmentStore.setAssignments(courseId, processedAssignments);
		}
	});

	// Track assignments with completion status
	let assignmentsWithStatus: Record<string, AssignmentWithStatus> = {};

	// Subscribe to the assignments store to get real-time updates
	$: {
		const unsubscribe = assignmentStore.assignments.subscribe((data) => {
			assignmentsWithStatus = data[courseId] || {};
			// Recalculate completion count and percentage when the store updates
			updateProgressStats();
		});
	}

	// Track progress stats
	let completedCount = 0;
	let progressPercentage = 0;

	// Confetti state
	let confettiForAssignment: AssignmentMeta | null = null;

	// Function to update progress stats
	function updateProgressStats() {
		if (processedAssignments.length === 0) return;

		completedCount = processedAssignments.filter((assignment) =>
			isAssignmentDone(assignment)
		).length;
		progressPercentage = Math.round((completedCount / processedAssignments.length) * 100);
	}

	// Check if an assignment is completed using the store data
	function isAssignmentDone(assignment: AssignmentMeta): boolean {
		// Try to get the assignment from the store
		const storeAssignment = assignmentsWithStatus[assignment.id];
		if (storeAssignment) {
			return storeAssignment.completed;
		}

		// Fallback to the direct method if not in store yet
		return browser ? assignmentStore.isCompleted(courseId, assignment.id) : false;
	}

	// Toggle assignment completion status
	function toggleAssignmentCompletion(assignment: AssignmentMeta) {
		if (!browser) return;

		const wasCompleted = isAssignmentDone(assignment);

		if (wasCompleted) {
			assignmentStore.markIncomplete(courseId, assignment.id);
		} else {
			assignmentStore.markComplete(courseId, assignment.id);

			// Show confetti for this specific assignment
			confettiForAssignment = assignment;
			setTimeout(() => (confettiForAssignment = null), 3000);
		}
	}

	// Make totalAssignments reactive
	$: totalAssignments = processedAssignments.length;

	// Ensure progress is updated when processedAssignments change
	$: {
		if (Object.keys(assignmentsWithStatus).length > 0 && totalAssignments > 0) {
			updateProgressStats();
		}
	}

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
			assignmentsForDate.every((assignment) => isAssignmentDone(assignment));

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
				<div
					class="bg-muted border-foreground btn-drop-shadow w-full max-w-sm rounded-lg border-2 p-3"
				>
					<div class="flex items-center justify-between gap-1">
						<div class="flex-1 text-right">
							<p class="font-archivo text-foreground text-sm font-bold uppercase">
								Progress ({completedCount}/{totalAssignments})
							</p>
						</div>
						<div
							class="bg-card border-foreground flex h-16 w-full items-center justify-start overflow-hidden rounded-sm border-2"
						>
							<div
								class="bg-secondary h-full transition-all duration-500 ease-out"
								style="width: {progressPercentage}%"
							></div>
							<p
								class="font-archivo absolute {completedCount === totalAssignments
									? 'text-secondary-foreground'
									: 'text-foreground'} mt-4 ml-2 text-right font-bold"
								style="color: {completedCount === totalAssignments
									? 'hsl(var(--secondary-foreground))'
									: 'hsl(var(--foreground))'}"
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
				class="bg-primary hover:bg-primary/80 font-roboto border-foreground btn-drop-shadow mt-6 inline-block rounded-md border-2 px-6 py-2 font-bold text-primary-foreground uppercase transition-colors"
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
									isAssignmentDone(assignment)
										? 'bg-secondary bg-opacity-10  border-y border-foreground'
										: 'hover:bg-muted'
								}`}
							>
								<div class="flex flex-col justify-between gap-4 md:flex-row md:items-start">
									<div class="flex-1">
										<h3
											class="font-roboto text-foreground text-md mb-1 flex items-center gap-2 font-bold"
										>
											<span class={isAssignmentDone(assignment) ? 'text-secondary-foreground' : 'text-foreground'}>
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
											class:text-secondary-foreground={isAssignmentDone(assignment)}
											class:text-foreground={!isAssignmentDone(assignment)}
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
													class="{isAssignmentDone(assignment)
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
											onclick={() => toggleAssignmentCompletion(assignment)}
											class={`flex transform items-center gap-2 rounded-md px-4 py-2 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 ${
												isAssignmentDone(assignment)
													? 'bg-secondary border-foreground border-2 text-secondary-foreground shadow-inner'
													: 'bg-muted text-foreground hover:bg-secondary border-foreground border-2 hover:text-secondary-foreground'
											}`}
											aria-label={isAssignmentDone(assignment)
												? 'Mark as incomplete'
												: 'Mark as complete'}
										>
											{#if isAssignmentDone(assignment)}
												<Check class="h-5 w-5" />
											{/if}
											<span class="font-archivo text-sm font-bold"
												>{isAssignmentDone(assignment) ? 'Completed' : 'Mark complete'}</span
											>
										</button>

										{#if assignment.path}
											<a
												href={assignment.path}
												class="bg-primary hover:bg-primary/80 border-foreground btn-drop-shadow flex transform items-center gap-2 rounded-md border-2 px-4 py-2 text-primary-foreground transition-all hover:-translate-y-1 active:translate-y-0"
												aria-label="View assignment details"
											>
												<ExternalLink class="h-5 w-5" />
												<span class="font-archivo text-sm font-bold">View</span>
											</a>
										{/if}
									</div>
								</div>

								<!-- Assignment-specific confetti -->
								{#if confettiForAssignment && confettiForAssignment.id === assignment.id}
									<div
										use:confetti={{
											particleCount: 75,
											force: 0.7,
											stageWidth: 800,
											stageHeight: 400,
											colors: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--primary) / 0.8)', 'hsl(var(--secondary) / 0.8)']
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
