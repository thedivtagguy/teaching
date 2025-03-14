<script lang="ts">
  import CourseLayout from '$lib/components/CourseLayout.svelte';
  import type { MenuDataType } from '$lib/utils/menu';
  
  // Get data from parent layout load function
  export let data: {
    menuData: MenuDataType;
    availableCourses: string[];
  };
</script>

<svelte:head>
  <title>University Course Pages</title>
</svelte:head>

<CourseLayout menuData={data.menuData} availableCourses={data.availableCourses}>
  <slot />
</CourseLayout> 