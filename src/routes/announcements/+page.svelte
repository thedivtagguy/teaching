<script>
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { getAnnouncements } from '$lib/utils/announcements';
  
  export let data;
</script>

<div class="prose prose-slate max-w-none">
  <h1>Announcements</h1>
  
  {#each data.announcements as announcement}
    <div class="announcement-card mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-xl font-bold text-gray-900">{announcement.title}</h2>
        <span class="text-sm text-gray-500">{announcement.date}</span>
      </div>
      <div class="text-gray-700">
        {@html announcement.content}
      </div>
    </div>
  {/each}
</div>

<style>
  .announcement-card {
    transition: all 0.2s ease-in-out;
  }
  
  .announcement-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
</style> 