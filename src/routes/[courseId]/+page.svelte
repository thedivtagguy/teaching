<script lang="ts">
  import { page } from '$app/stores';
  import type { MenuDataType, MenuSection, MenuItem } from '$lib/utils/menu';
  
  // Get course ID from URL parameter
  const courseId = $page.params.courseId;
  
  // Get course metadata from page data (loaded by +page.server.ts)
  $: metadata = $page.data.courseMetadata;
  
  // Get menu data from the page data (populated by layout.server.ts)
  $: menuData = ($page.data.menuData?.[courseId] || { sections: [] }) as { sections: MenuSection[] };
  
  // Filter sections to exclude Course Info
  $: contentSections = menuData.sections.filter(section => section.title !== 'Course Info');
</script>

<svelte:head>
  <title>{metadata.title || courseId} | Course</title>
  <meta name="description" content={metadata.description || `Course page for ${courseId}`} />
</svelte:head>

<div class="max-w-3xl">
  <h1 class="text-3xl font-libre-caslon mb-3">{metadata.title}</h1>
  <h2 class="text-xl text-gray-600 font-archivo mb-6">{metadata.term}</h2>
  
  <div class="bg-white mb-8">
   
    <!-- <p class="font-archivo mb-4">
      {metadata.description}
    </p> -->
    
    {#if metadata?.instructor}
      <div class="bg-blue-50 p-4 rounded-md mb-4">
        <h3 class="!font-archivo font-semibold mb-2">Instructor</h3>
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
      <a href="/{courseId}/syllabus" class="inline-block bg-blue text-white py-2 px-4 rounded font-archivo transition-colors hover:bg-purple">
        View Syllabus
      </a>
      <a href="/{courseId}/schedule" class="inline-block bg-blue text-white py-2 px-4 rounded font-archivo transition-colors hover:bg-purple">
        View Schedule
      </a>
      <a href="/{courseId}/submit" class="inline-block border border-blue text-blue py-2 px-4 rounded font-archivo transition-colors hover:bg-blue hover:text-white">
        Submit Form
      </a>
    </div>
  </div>
  
  <div class="bg-gray-50 rounded-lg p-6">
    <h2 class="text-xl font-libre-caslon mb-4">Quick Links</h2>
    
    <!-- Dynamically generate module quick links based on metadata sections -->
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
      
      <!-- If no sections found, show a message -->
      {#if contentSections.length === 0}
        <div class="bg-white p-4 rounded border border-gray-100 col-span-2">
          <p class="text-gray-500">No course content available yet.</p>
        </div>
      {/if}
    </div>
  </div>
</div> 