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
  $: contentSections = menu?.sections?.filter(section => section.title !== 'Course Info') || [];

  // For the outline content
  let outlineContent: any = null;
  let error: string | null = null;

  // Load the outline content when component mounts
  onMount(async () => {
    try {
      // Dynamically import the outline content
      const module = await import(`../../content/${courseId}/outline.svx`);
      outlineContent = module.default;
    } catch (err) {
      error = `Could not load outline content for ${courseId}`;
      console.error(err);
    }
  });
</script>

<SEO 
  title={metadata.title || courseId}
  description={metadata.description || `Course page for ${courseId}`}
  courseId={courseId}
  contentType="page"
  date={metadata.term || ''}
/>

<!-- Two-column layout on desktop, single column on mobile -->
<div class="max-w-7xl mx-auto">
  <div class="flex flex-col md:flex-row">
    <div class="md:flex-1 md:max-w-3xl">
      <!-- Mobile Table of Contents at the top -->
      <div class="md:hidden mb-6">
        <TableOfContents />
      </div>

      <h1 class="text-3xl font-libre-caslon mb-3">{metadata.title}</h1>
      <h2 class="text-xl text-gray-600 font-archivo mb-6">{metadata.term}</h2>
      
      <div class="mb-8">
        {#if metadata?.instructor}
          <div class="bg-blue-50 p-4 rounded-md mb-4">
            <h3 class="!font-archivo font-semibold mb-2">Facilitator</h3>
            <p class="mb-1">{metadata.instructor.name}</p>
            <p class="mb-1">
              <a href="mailto:{metadata.instructor.email}" class="text-blue hover:underline">
                {metadata.instructor.email}
              </a>
            </p>
            <p class="mb-1">{metadata.instructor.office}</p>
            <p>Office Hours: {metadata.instructor.hours}</p>
          </div>
        {/if}
        
        <!-- <div class="mt-6 flex flex-col sm:flex-row gap-4">
          <a href="/{courseId}/" class="pointer-events-none opacity-50 inline-block border border-blue text-blue py-2 px-4 rounded font-archivo transition-colors hover:bg-blue hover:text-white">
            Daily Survey
          </a>
        </div> -->
      </div>
      
      {#if outlineContent}
        <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
          <MDLayout metadata={outlineContent.metadata || {}}>
            <svelte:component this={outlineContent} />
          </MDLayout>
        </div>
      {:else if error}
        <div class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 mb-6">
          <p>{error}</p>
        </div>
      {:else}
        <div class="flex justify-center items-center h-32 bg-white rounded-lg mb-6">
          <div class="animate-pulse text-gray-400 font-archivo">
            Loading syllabus...
          </div>
        </div>
      {/if}
    </div>
    
    <!-- Right sidebar with Table of Contents (desktop only) -->
    <div class="hidden md:block md:w-64 md:pl-8 md:sticky md:top-8 md:self-start md:max-h-screen md:overflow-y-auto">
      <TableOfContents />
    </div>
  </div>
</div> 