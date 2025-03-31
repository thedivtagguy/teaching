<script>
  const resources = [
    {
      title: "CDV2025 - Introduction to Data Visualization",
      description: "Introduction to data visualization for design students taught at Chitkara University, 2025",
      link: "/cdv2025",
      color: "bg-orange"
    },
  
    {
      title: "Introduction to QGIS",
      description: "Gentle introduction to QGIS for beginners, with a focus on using OpenStreetMap data",
      link: "https://aman.bh/qgis",
      color: "bg-blue"
    },
    {
      title: "R with Penguins",
      description: "A gentle introduction to R and summary statistics with the penguins dataset",
      link: "https://rwithpenguins.netlify.app/",
      color: "bg-sage"
    }
  ]
</script>

<svelte:head>
  <title>Learning Resources</title>
</svelte:head>

<div class="max-w-[1000px] mx-auto p-8 noise-image">
  <header class="mb-6 pb-2 border-b-2 border-neutral text-center">
    <h1 class="text-5xl text-neutral mb-1 font-libre-caslon uppercase ">AMAN'S GENERAL MISHMASH OF</h1>
    <h1 class="text-5xl text-neutral mb-4 font-libre-caslon uppercase ">LEARNING RESOURCES</h1>
  </header>
  
  <main class="min-h-[70svh]">
    <div class="grid grid-cols-1  gap-6 mb-12">
      
      
      {#each resources as resource, i}
      <div class="bg-base-100 rounded-lg border-2 border-neutral overflow-hidden">
        <div class="p-6 {resource.color}">
          <h2 class="text-2xl font-bold text-neutral font-libre-caslon">{resource.title}</h2>
          <p class="mt-2 font-archivo text-neutral">{resource.description}</p>
          <a href={resource.link} class="mt-4 inline-block bg-base-200 text-neutral py-2 px-4 rounded-md border-2 border-neutral btn-drop-shadow font-roboto font-bold uppercase transition-colors hover:bg-neutral hover:text-white">View</a>
        </div>
      </div>
      {/each}
    </div>
    
  
    
  </main>
  
  <footer class="mt-12 border-t border-base-300 pt-4 text-base-300">
    <p class="font-archivo">Licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" class="text-blue">CC BY-NC-SA 4.0<img class="inline-block w-16 ml-2 h-auto" src="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc-sa.png" alt="CC BY-NC-SA 4.0"></a></p>
  </footer>
</div>
