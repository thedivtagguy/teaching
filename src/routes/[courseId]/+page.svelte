<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO.svelte';
	import MDLayout from '$lib/components/MDLayout.svelte';
	import TableOfContents from '$lib/components/TableOfContents.svelte';
	import type { MenuSection, CourseMeta, CourseMenu } from '$lib/utils/contentSchema';

	// Get course ID from URL parameter
	const courseId = $page.params.courseId;

	// Get course data from page data (loaded by +page.server.ts)
	$: courseData = $page.data.courseData;
	$: metadata = courseData?.metadata as CourseMeta;
	$: menu = courseData?.menu as CourseMenu;

	// Filter sections to exclude Course Info
	$: contentSections = menu?.sections?.filter((section) => section.title !== 'Course Info') || [];

	// For the outline content
	let outlineContent: any = null;
	let error: string | null = null;

	// Load the outline content when component mounts
	onMount(async () => {
		// Try loading with different extensions
		const extensions = ['.svx', '.md'];
		
		for (const ext of extensions) {
			try {
				// Dynamically import the outline content
				const module = await import(`../../content/${courseId}/outline${ext}`);
				outlineContent = module.default;
				return; // Exit early if successful
			} catch (err) {
				// Continue to next extension if this one fails
				continue;
			}
		}
		
		// If we get here, none of the extensions worked
		error = `Could not load outline content for ${courseId}`;
		console.error(`No supported outline file found for ${courseId}`);
	});
</script>

<SEO
	title={metadata.title || courseId}
	description={metadata.description || `Course page for ${courseId}`}
	{courseId}
	contentType="page"
	date={metadata.term || ''}
/>

<!-- Two-column layout on desktop, single column on mobile -->
<div class="mx-auto max-w-7xl">
	<div class="flex flex-col md:flex-row">
		<div class="md:max-w-3xl md:flex-1">
			<!-- Mobile Table of Contents at the top -->
			<div class="mb-6 md:hidden">
				<TableOfContents />
			</div>

			<h1 class="font-libre-caslon mb-3 text-3xl">{metadata.title}</h1>
			<h2 class="text-muted-foreground font-archivo mb-6 text-xl">{metadata.term}</h2>

			<div class="mb-8">
				{#if metadata?.instructor}
					<div class="bg-primary/10 mb-4 rounded-md p-4">
						<h3 class="!font-archivo = mb-2 !text-lg font-semibold">Facilitator</h3>
						<p class="mb-1">{metadata.instructor.name}</p>
						<p class="mb-1">
							<a href="mailto:{metadata.instructor.email}" class="text-primary hover:underline">
								{metadata.instructor.email}
							</a>
						</p>
						<p class="mb-1">{metadata.instructor.office}</p>
						<p>Office Hours: {metadata.instructor.hours}</p>
					</div>
				{/if}

				<!-- <div class="mt-6 flex flex-col sm:flex-row gap-4">
          <a href="/{courseId}/" class="pointer-events-none opacity-50 inline-block border border-primary text-primary py-2 px-4 rounded font-archivo transition-colors hover:bg-primary hover:text-white">
            Daily Survey
          </a>
        </div> -->
			</div>

			{#if outlineContent}
				<div class="bg-card mb-8 rounded-lg p-6 shadow-sm">
					<MDLayout metadata={outlineContent.metadata || {}}>
						<svelte:component this={outlineContent} />
					</MDLayout>
				</div>
			{:else if error}
				<div
					class="bg-destructive/10 border-destructive/20 text-destructive mb-6 rounded-lg border p-6"
				>
					<p>{error}</p>
				</div>
			{:else}
				<div class="bg-card mb-6 flex h-32 items-center justify-center rounded-lg">
					<div class="text-muted-foreground font-archivo animate-pulse">Loading syllabus...</div>
				</div>
			{/if}
		</div>

		<!-- Right sidebar with Table of Contents (desktop only) -->
		<div
			class="hidden md:sticky md:top-8 md:block md:max-h-screen md:w-64 md:self-start md:overflow-y-auto md:pl-8"
		>
			<TableOfContents />
		</div>
	</div>
</div>
