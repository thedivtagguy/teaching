<script lang="ts">
  import { page } from '$app/stores';
  import SEO from '$lib/components/SEO.svelte';
  import type { MenuSection, CourseMeta, CourseMenu } from '$lib/utils/contentSchema';
  
  // Get course ID from URL parameter
  const courseId = $page.params.courseId;
  
  // Get course data from page data (loaded by +page.server.ts)
  $: courseData = $page.data.courseData;
  $: metadata = courseData?.metadata as CourseMeta;
  $: menu = courseData?.menu as CourseMenu;
  
  // Filter sections to exclude Course Info
  $: contentSections = menu?.sections?.filter(section => section.title !== 'Course Info') || [];
</script>

<SEO 
  title={metadata.title || courseId}
  description={metadata.description || `Course page for ${courseId}`}
  courseId={courseId}
  contentType="page"
  date={metadata.term || ''}
/>

<div class="max-w-3xl">
  <h1 class="text-3xl font-libre-caslon mb-3">{metadata.title}</h1>
  <h2 class="text-xl text-gray-600 font-archivo mb-6">{metadata.term}</h2>
  
  <div class=" mb-8">
   
    <!-- <p class="font-archivo mb-4">
      {metadata.description}
    </p> -->
    
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
    
    <div class="mt-6 flex flex-col sm:flex-row gap-4">
      <a href="/{courseId}/outline" class="inline-block bg-blue text-white py-2 px-4 rounded font-archivo transition-colors hover:bg-purple">
        Info & Syllabus
      </a>
      <a href="/{courseId}/" class="pointer-events-none opacity-50 inline-block border border-blue text-blue py-2 px-4 rounded font-archivo transition-colors hover:bg-blue hover:text-white">
        Daily Survey
      </a>
    </div>
  </div>
  
  <!-- <div>
    <h2 class="text-xl font-libre-caslon mb-4">Quick Links</h2>
    

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each contentSections as section (section.title)}
        <div class="bg-white p-4 rounded border border-gray-100">
          <h3 class="font-archivo font-semibold mb-2">{section.title}</h3>
          <ul class="space-y-1">
            {#each section.items as item (item.path)}
              <li><a href={item.path} class="text-blue hover:underline">{item.title}</a></li>
            {/each}
          </ul>
        </div>
      {/each}
    
      {#if contentSections.length === 0}
        <div class="bg-white p-4 rounded border border-gray-100 col-span-2">
          <p class="text-gray-500">No course content available yet.</p>
        </div>
      {/if}
    </div> 
  </div>-->
</div> 