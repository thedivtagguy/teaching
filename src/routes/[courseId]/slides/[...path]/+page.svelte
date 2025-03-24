<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<div class="w-full h-screen">
  <iframe 
    src={data.slideUrl} 
    title="Course Slides" 
    class="w-full h-full border-0"
    allow="fullscreen"
  ></iframe>
</div> 