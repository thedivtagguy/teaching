<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import MDLayout from '$lib/components/MDLayout.svelte';
	import TableOfContents from '$lib/components/TableOfContents.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { Calendar, BookOpen, Clipboard, ArrowLeft, ArrowRight } from 'lucide-svelte';
	import { getContentFile } from '$lib/utils/contentService';
	import { extractSEOData } from '$lib/utils/seo';
	import type { MenuSection, MenuItem, CourseMenu } from '$lib/utils/contentSchema';
	import Button from '$lib/components/ui/button/button.svelte';

	// Get course ID and day ID from URL params
	$: courseId = $page.params.courseId;
	$: dayId = $page.params.dayId;

	let content: any = null;
	let error: string | null = null;

	// Get menu data for navigation between days
	$: menuData = ($page.data.menuData?.[courseId] as CourseMenu) || {
		sections: [],
		title: '',
		readings: [],
		assignments: [],
		devNotes: ''
	};
	$: currentDayPath = `/${courseId}/${dayId}`;

	// Find next and previous pages for navigation
	$: {
		let allItems: MenuItem[] = [];
		menuData.sections.forEach((section: MenuSection) => {
			allItems = [...allItems, ...section.items];
		});

		// Sort all items by their order property
		allItems.sort((a, b) => {
			const orderA = a.order !== undefined ? a.order : 999;
			const orderB = b.order !== undefined ? b.order : 999;
			return orderA - orderB;
		});

		const currentIndex = allItems.findIndex((item) => item.path === currentDayPath);
		previousPage = currentIndex > 0 ? allItems[currentIndex - 1] : null;
		nextPage = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;
	}

	let previousPage: MenuItem | null = null;
	let nextPage: MenuItem | null = null;

	// Use a reactive statement instead of onMount to load content
	// This will re-run whenever courseId or dayId changes
	$: {
		// Reset content and error when parameters change
		content = null;
		error = null;

		try {
			// Use content service to get the content
			const module = getContentFile(courseId, dayId);

			if (module) {
				content = module.default;
				content.metadata = module.metadata; // Fix: attach metadata to content
			} else {
				error = `Could not load content for ${courseId}/${dayId}`;
				console.error(`No supported file found for ${courseId}/${dayId}`);
			}
		} catch (err) {
			error = `Could not load content for ${courseId}/${dayId}`;
			console.error(`Error loading content for ${courseId}/${dayId}:`, err);
		}
	}

	// Extract SEO data from content metadata
	$: seoData = content?.metadata
		? extractSEOData(content.metadata, {
				courseId,
				contentType: 'day',
				fallbackTitle: content.metadata.title || dayId,
				fallbackDescription: content.metadata.description || `Course material for ${courseId}`
			})
		: null;
</script>

<SEO
	title={seoData?.title || dayId}
	description={seoData?.description || `Course material for ${courseId}`}
	keywords={seoData?.keywords || ''}
	image={seoData?.image || ''}
	author={seoData?.author || ''}
	canonical={seoData?.canonical || ''}
	type={seoData?.type || 'article'}
	{courseId}
	contentType="day"
	date={seoData?.date || ''}
/>

<!-- Two-column layout on desktop, single column on mobile -->
<div class="mx-auto max-w-7xl">
	{#if error}
		<div
			class="bg-destructive/10 border-destructive/20 text-destructive mb-6 rounded-lg border p-6 shadow-sm"
		>
			<p class="font-archivo mb-4 text-lg">{error}</p>
			<p class="mt-2">
				<a
					href="/{courseId}"
					class="bg-destructive/10 text-destructive hover:bg-destructive/20 font-archivo inline-flex items-center rounded px-4 py-2 transition-colors"
				>
					<ArrowLeft class="mr-2 h-4 w-4" />
					Return to course page
				</a>
			</p>
		</div>
	{:else if content}
		<div class="flex flex-col md:flex-row">
			<!-- Main content area -->
			<div class="md:max-w-3xl md:flex-1">
				<!-- Mobile Table of Contents at the top -->
				<div class="md:hidden">
					<TableOfContents />
				</div>

				<div>
					<!-- Content header with title, date & description -->
					<div class="mb-4">
						<!-- <h1 class="text-3xl font-libre-caslon mb-2">{content.metadata?.title || `${dayId.charAt(0).toUpperCase() + dayId.slice(1)}`}</h1> -->

						<div class="text-muted-foreground flex flex-wrap gap-4 text-sm">
							{#if content.metadata?.date && content.metadata?.show_metadata_card !== true}
								<div class="flex items-center">
									<Calendar class="text-primary mr-1 h-4 w-4" />
									<span class="font-archivo"
										>{new Date(content.metadata.date).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}</span
									>
								</div>
							{/if}
							{#if content.metadata?.section === 'Appendix'}
								<div class="flex items-center">
									<BookOpen class="text-primary mr-1 h-4 w-4" />
									<span class="font-archivo">{content.metadata.section}</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Quick Access card -->
					{#if content.metadata?.show_metadata_card}
						<div class="bg-muted/30 border-border mb-6 rounded-xs border p-4">
							<div class="flex flex-wrap items-center gap-4">
								{#if content.metadata?.date}
									<div class="flex items-center">
										<Calendar class="text-primary mr-1 h-4 w-4" />
										<span class="font-archivo text-muted-foreground text-sm font-medium"
											>{new Date(content.metadata.date).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})}</span
										>
									</div>
								{/if}
								{#if content.metadata?.slides}
									<Button href={content.metadata.slides} target="_blank" rel="noopener noreferrer">
										<BookOpen class="mr-2 h-4 w-4" />
										<span class="font-archivo text-sm font-medium">Today's Slides</span>
									</Button>
								{/if}
								{#if content.metadata?.devNotes}
									<Button
										href={content.metadata.devNotes}
										target="_blank"
										rel="noopener noreferrer"
										variant="blue"
									>
										<Clipboard class="mr-2 h-4 w-4" />
										<span class="font-archivo text-sm font-medium">Dev Notes</span>
									</Button>
								{/if}
								{#if content.metadata?.assignments}
									<Button href="/{courseId}/assignments" variant="secondary">
										<Clipboard class="mr-2 h-4 w-4" />
										<span class="font-archivo text-sm font-medium">Assignments</span>
									</Button>
								{/if}

								{#if content.metadata?.readings && content.metadata?.readings.length > 0}
									<Button href="/{courseId}/readings?day={content.metadata.slug}" variant="secondary">
										<BookOpen class="mr-2 h-4 w-4" />
										<span class="font-archivo text-sm font-medium">Readings</span>
									</Button>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Main content area with improved MDLayout -->
					<MDLayout metadata={content.metadata} {courseId} fileName={dayId} fileType="day">
						<svelte:component this={content} />
					</MDLayout>

					<!-- Content navigation (previous/next) -->
					<div class="border-border mt-8 flex items-center justify-between border-t pt-6">
						{#if previousPage}
							<a
								href={previousPage.path}
								class="text-primary hover:text-primary hover:bg-primary/10 inline-flex items-center rounded p-2 pr-4 transition-colors"
							>
								<ArrowLeft class="mr-2 h-4 w-4" />
								<span class="font-archivo text-sm">{previousPage.title}</span>
							</a>
						{:else}
							<div></div>
						{/if}

						<a
							href="/{courseId}"
							class="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center rounded p-2 px-4 transition-colors"
						>
							<span class="font-archivo text-sm">Course Home</span>
						</a>

						{#if nextPage}
							<a
								href={nextPage.path}
								class="text-primary hover:text-primary hover:bg-primary/10 inline-flex items-center rounded p-2 pl-4 transition-colors"
							>
								<span class="font-archivo text-sm">{nextPage.title}</span>
								<ArrowRight class="ml-2 h-4 w-4" />
							</a>
						{:else}
							<div></div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Right sidebar with Table of Contents (desktop only) -->
			<div
				class="hidden md:sticky md:top-8 md:block md:max-h-screen md:w-64 md:self-start md:overflow-y-auto md:pl-8"
			>
				<TableOfContents />
			</div>
		</div>
	{:else}
		<div class="bg-card flex h-64 items-center justify-center rounded-lg shadow-sm">
			<div class="text-muted-foreground font-archivo flex animate-pulse flex-col items-center">
				<div
					class="border-t-primary border-primary/20 mb-4 h-8 w-8 animate-spin rounded-full border-4"
				></div>
				<div>Loading content...</div>
			</div>
		</div>
	{/if}
</div>
