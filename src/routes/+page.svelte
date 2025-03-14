<script>
  const resources = [
    {
      title: "CDV2025 - Introduction to Data Visualization",
      description: "Introduction to data visualization for design students taught at Chitkara University, 2025",
      link: "/cdv2025"
    },
    {
      title: "Introduction to QGIS",
      description: "Gentle introduction to QGIS for beginners, with a focus on using OpenStreetMap data",
      link: "https://aman.bh/qgis"
    }
  ]
</script>

<svelte:head>
  <title>Resources</title>
</svelte:head>

<div class="max-w-[1000px] mx-auto p-8">
  <header class="mb-12 border-b border-base-300 pb-4">
    <h1 class="text-4xl text-blue mb-2 font-libre-caslon">Resources</h1>
    <p class="font-archivo">Lecture notes, readings, and other resources by <a href="https://aman.bh" class="text-blue">Aman Bhargava</a></p>
  </header>
  
  <main class="min-h-[70svh]">
    <div class="flex flex-col gap-8 mb-12">
      {#each resources as resource}
      <div class="flex-1 min-w-[250px]  rounded-lg flex flex-col">
        <h2 class="text-neutral font-libre-caslon text-2xl font-bold">{resource.title}</h2>
        <div class="flex  items-center justify-between gap-4">
          <p class=" font-archivo">{resource.description}</p>
          <a href={resource.link} class="inline bg-blue text-white py-3 px-6 rounded font-medium text-center transition-colors hover:bg-purple">View</a>
        </div></div>
      {/each}
      
    </div>
    
 
  </main>
  
  <footer class="mt-12  border-t border-base-300 pt-4 text-base-300">
   
      <p>Licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer">CC BY-NC-SA 4.0<img class="inline-block w-16 ml-2 h-auto" src="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc-sa.png" alt="CC BY-NC-SA 4.0"></a></p>
 
  </footer>
</div>
