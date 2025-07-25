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

<div class="bg-background flex min-h-screen flex-col lg:flex-row">
	<!-- Mobile header with menu toggle -->
	<div
		class="fixed right-5 bottom-5 z-[var(--z-docked)] flex items-center justify-between p-4 lg:hidden"
	>
		<Drawer bind:open={isMenuOpen}>
			<DrawerTrigger asChild let:builder class="ml-auto">
				{#snippet children(builder)}
					<Button builders={[builder]} variant="default" size="lg" aria-label="Toggle menu">
						{#if isMenuOpen}
							<X class="size-5" />
						{:else}
							<Menu class="size-5" />
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
	<aside class={cn('bg-background border-border border-r p-6', 'hidden lg:block lg:w-1/5')}>
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
	<main class="noise-image bg-background flex-1 p-6 lg:p-8">
		<slot />
	</main>
</div>
