<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { Menu, X } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils/index.js';
	import {
		Drawer,
		DrawerContent,
		DrawerHeader,
		DrawerTitle,
		DrawerTrigger,
		DrawerOverlay
	} from '$lib/components/ui/drawer/index.js';
	import CourseMenu from './CourseMenu.svelte';
	import type {
		MenuDataType,
		CourseMenu as CourseMenuType,
		Reading,
		Assignment
	} from '$lib/utils/contentSchema';

	export let menuData: MenuDataType = {};
	export let availableCourses: string[] = ['cdv2025', 'cs201'];

	// Get current course from URL or default to first available
	const courseIdFromUrl = $page.params.courseId || '';
	const selectedCourse = writable<string>(
		availableCourses.includes(courseIdFromUrl) ? courseIdFromUrl : availableCourses[0]
	);

	// Reactive variable to extract current day's content if available
	$: currentDayContent = $page.data?.content?.metadata || null;

	// Track if menu is open (for mobile)
	let isMenuOpen = false;

	// Close menu when changing pages (for mobile)
	$: if ($page.url) {
		isMenuOpen = false;
	}

	// Handle course selection change
	function handleCourseChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		const newCourse = target.value;
		$selectedCourse = newCourse;

		// Redirect to the new course's main page using SvelteKit navigation
		const baseUrl = `/${newCourse}`;
		goto(baseUrl);
	}

	// Extract readings and assignments from current page data if available
	$: currentCourseData = $selectedCourse ? (menuData[$selectedCourse] as CourseMenuType) || {} : {};

	// Combine course readings and current page readings if both exist
	$: combinedMenuData = {
		...currentCourseData,
		readings: [
			...(currentCourseData.readings || []),
			// If current page has readings, add those too
			...((currentDayContent?.readings || []) as Reading[])
		],
		assignments: [
			...(currentCourseData.assignments || []),
			// If current page has assignments, add those too
			...((currentDayContent?.assignments || []) as Assignment[])
		]
	} as CourseMenuType;
</script>

<div class="bg-background flex min-h-screen flex-col md:flex-row">
	<!-- Mobile header with menu toggle -->
	<div
		class="bg-background border-border sticky top-0 z-[var(--z-docked)] flex items-center justify-between border-b p-4 md:hidden"
	>
		<Drawer bind:open={isMenuOpen}>
			<DrawerTrigger asChild let:builder>
				{#snippet children(builder)}
					<Button
						builders={[builder]}
						variant="outline"
						size="icon"
						class={cn(
							'border-foreground border-2',
							'shadow-[var(--shadow-btn-drop)] transition-all duration-[var(--duration-250)]',
							'hover:-translate-y-0.5 hover:shadow-[var(--shadow-btn-hover)]',
							'font-roboto font-bold'
						)}
						aria-label="Toggle menu"
					>
						{#if isMenuOpen}
							<X class="h-5 w-5" />
						{:else}
							<Menu class="h-5 w-5" />
						{/if}
					</Button>
				{/snippet}
			</DrawerTrigger>
			<DrawerContent class="max-h-[80vh]">
				<div class="overflow-y-auto p-4">
					{#if menuData[$selectedCourse]}
						<CourseMenu
							courseId={$selectedCourse}
							menuData={combinedMenuData}
							selectedCourse={$selectedCourse}
						/>
					{/if}
				</div>
			</DrawerContent>
		</Drawer>
	</div>

	<!-- Sidebar - fixed on desktop, hidden on mobile -->
	<aside class={cn('bg-background border-border border-r p-6', 'hidden md:block md:w-1/5')}>
		<!-- Use our enhanced CourseMenu component with combined data -->
		{#if menuData[$selectedCourse]}
			<CourseMenu
				courseId={$selectedCourse}
				menuData={combinedMenuData}
				selectedCourse={$selectedCourse}
			/>
		{/if}
	</aside>

	<!-- Main content area -->
	<main class="noise-image bg-background flex-1 p-6 md:p-8">
		<slot />
	</main>
</div>
