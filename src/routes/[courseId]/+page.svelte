<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO.svelte';
	import MDLayout from '$lib/components/MDLayout.svelte';
	import TableOfContents from '$lib/components/TableOfContents.svelte';
	import { getContentFile } from '$lib/utils/contentService';
	import { extractSEOData } from '$lib/utils/seo';
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
		try {
			// Use content service to get the outline content
			const module = getContentFile(courseId, 'outline');
			if (module) {
				outlineContent = module.default;
				outlineContent.metadata = module.metadata; // Fix: attach metadata to content
			} else {
				error = `Could not load outline content for ${courseId}`;
				console.error(`No supported outline file found for ${courseId}`);
			}
		} catch (err) {
			error = `Could not load outline content for ${courseId}`;
			console.error(`Error loading outline for ${courseId}:`, err);
		}
	});

	// Extract SEO data from outline content
	$: seoData = outlineContent?.metadata
		? extractSEOData(outlineContent.metadata, {
				courseId,
				contentType: 'page',
				fallbackTitle: metadata?.title || `${courseId} Course`,
				fallbackDescription: metadata?.description || `Course page for ${courseId}`
			})
		: null;
</script>

<SEO
	title={seoData?.title || metadata?.title || courseId}
	description={seoData?.description || metadata?.description || `Course page for ${courseId}`}
	keywords={seoData?.keywords || ''}
	image={seoData?.image || ''}
	author={seoData?.author || ''}
	canonical={seoData?.canonical || ''}
	type={seoData?.type || 'website'}
	{courseId}
	contentType="page"
	date={seoData?.date || metadata?.term || ''}
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
					<div class="bg-primary/10 !font-archivo rounded-md p-4">
						<div class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
							<div>
								<span class="!text-sm font-medium">Facilitator:</span>
								<span class="ml-2">{metadata.instructor.name}</span>
							</div>

							<div class="col-span-2">
								<span class="font-medium">Email:</span>
								<a
									href="mailto:{metadata.instructor.email}"
									class="text-primary ml-2 hover:underline"
								>
									{metadata.instructor.email}
								</a>
							</div>
							<div class="col-span-2">
								<span class="font-medium">Office Hours:</span>
								<span class="ml-2">{metadata.instructor.hours}</span>
							</div>
						</div>
					</div>
				{/if}

				<!-- <div class="mt-6 flex flex-col sm:flex-row gap-4">
          <a href="/{courseId}/" class="pointer-events-none opacity-50 inline-block border border-primary text-primary py-2 px-4 rounded font-archivo transition-colors hover:bg-primary hover:text-white">
            Daily Survey
          </a>
        </div> -->
			</div>

			{#if outlineContent}
				<div class="bg-card mb-8">
					<MDLayout
						metadata={outlineContent.metadata || {}}
						{courseId}
						fileName="outline"
						fileType="page"
					>
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
