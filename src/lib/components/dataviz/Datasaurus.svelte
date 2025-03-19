<script lang="ts">
  import { onMount } from 'svelte';
  import { WebR } from 'webr';
  
  // Define variables
  let webR: any;
  let isWebRReady = false;
  let isLoading = true;
  let error: string | null = null;
  let currentDataset = "dino";
  let isVisualizationRevealed = false; // Track if visualization is revealed
  let datasets = [
    { id: "dino", name: "Dataset 1" },
    { id: "star", name: "Dataset 2" },
    { id: "circle", name: "Dataset 3" },
    { id: "x_shape", name: "Dataset 4" },
    { id: "h_lines", name: "Dataset 5" },
    { id: "v_lines", name: "Dataset 6" },
    { id: "wide_lines", name: "Dataset 7" },
    { id: "slant_up", name: "Dataset 8" },
    { id: "slant_down", name: "Dataset 9" },
    { id: "bullseye", name: "Dataset 10" },
    { id: "dots", name: "Dataset 11" }
  ];
  
  // Type the stats object properly
  interface Stats {
    mean_x: number | null;
    mean_y: number | null;
    sd_x: number | null;
    sd_y: number | null;
    correlation: number | null;
  }
  
  let stats: Stats = {
    mean_x: null,
    mean_y: null,
    sd_x: null,
    sd_y: null,
    correlation: null
  };
  
  let plotBase64 = "";
  let webRInitMessage = "Initializing WebR..."; // Message to display during initialization
  
  // Function to change dataset and update visualization
  async function changeDataset(datasetId: string) {
    if (!isWebRReady) return;
    
    currentDataset = datasetId;
    isLoading = true;
    error = null;
    isVisualizationRevealed = false; // Hide visualization when changing dataset
    
    try {
      // Calculate statistics for the selected dataset
      const statsResult = await webR.evalR(`
        library(datasauRus)
        library(dplyr)
        
        # Filter to the selected dataset
        df <- datasaurus_dozen %>%
          filter(dataset == "${datasetId}")
        
        # Calculate statistics
        mean_x <- mean(df$x)
        mean_y <- mean(df$y)
        sd_x <- sd(df$x)
        sd_y <- sd(df$y)
        correlation <- cor(df$x, df$y)
        
        # Return as simple numeric values
        c(mean_x, mean_y, sd_x, sd_y, correlation)
      `);
      
      // Get values as a JavaScript array of numbers
      const values = await statsResult.toArray();
      
      // Update stats with values
      stats = {
        mean_x: Number(values[0]),
        mean_y: Number(values[1]),
        sd_x: Number(values[2]),
        sd_y: Number(values[3]),
        correlation: Number(values[4])
      };
      
      // Generate plot for the selected dataset
      const plotResult = await webR.evalR(`
        library(ggplot2)
        
        # Create plot
        p <- ggplot(df, aes(x = x, y = y)) + 
          geom_point(color = "#4D80E6", size = 2) +
          theme_minimal() +
          labs(
            title = "${datasets.find(d => d.id === datasetId)?.name}",
            subtitle = "Same statistics, different visualization"
          ) +
          theme(
            plot.title = element_text(size = 16, face = "bold"),
            plot.subtitle = element_text(size = 12),
            axis.title = element_text(size = 12),
            panel.grid.minor = element_blank()
          )
        
        # Save plot to base64 string
        temp_file <- tempfile(fileext = ".png")
        ggsave(temp_file, p, width = 8, height = 6, dpi = 96)
        base64_encode <- function(file) {
          base64 <- base64enc::base64encode(file)
          return(base64)
        }
        base64_encode(temp_file)
      `);
      
      // Get base64 string for the plot
      plotBase64 = await plotResult.toString();
      
    } catch (e: unknown) {
      if (e instanceof Error) {
        error = e.message;
      } else {
        error = String(e);
      }
    } finally {
      isLoading = false;
    }
  }
  
  // Function to toggle visualization reveal
  function toggleVisualization() {
    isVisualizationRevealed = !isVisualizationRevealed;
  }
  
  onMount(async () => {
    try {
      webRInitMessage = "Initializing WebR...";
      // Initialize webR
      webR = new WebR();
      await webR.init();
      
      webRInitMessage = "Installing required R packages...";
      // Use webR's package manager to install the required packages
      await webR.evalR(`
        # Use webR's package installation system
        webr::install("datasauRus")
        webr::install("ggplot2")
        webr::install("base64enc")
        webr::install("dplyr")
      `);
      
      isWebRReady = true;
      
      // Initialize with the first dataset (dinosaur)
      await changeDataset("dino");
      
    } catch (e: unknown) {
      if (e instanceof Error) {
        error = `Failed to initialize: ${e.message}`;
      } else {
        error = `Failed to initialize: ${String(e)}`;
      }
      isLoading = false;
    }
  });
</script>

<!-- WebR Initialization Loading Overlay -->
{#if !isWebRReady}
<div class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
  <div class="text-center p-6 rounded-lg max-w-md">
    <div class="spinner mb-4"></div>
    <h2 class="text-xl font-bold mb-2">Loading R Environment</h2>
    <p class="text-gray-600">{webRInitMessage}</p>
    <p class="text-sm text-gray-500 mt-2">This may take a moment on first load...</p>
  </div>
</div>
{/if}

<div class="font-inter bg-gray-100 text-black leading-relaxed p-5">
  <div class="max-w-4xl mx-auto bg-white border border-black p-5">
    <h1 class="text-2xl font-bold border-b pb-2 mb-4">The Datasaurus Dozen</h1>
    
    <div class="flex gap-4">
       
        
        <div class="mb-6 flex-grow w-full">
          <label for="dataset-select" class="block font-bold mb-1">Select a dataset:</label>
          <select
            id="dataset-select"
            bind:value={currentDataset}
            on:change={() => changeDataset(currentDataset)}
            disabled={!isWebRReady || isLoading}
            class="border border-black p-2 w-full max-w-xs"
          >
            {#each datasets as dataset}
              <option value={dataset.id}>{dataset.name}</option>
            {/each}
          </select>
        </div>
        <p class="mb-4">
            The Datasaurus Dozen demonstrates why it's important to visualize your data.
            All of these datasets have nearly identical summary statistics (mean, standard deviation, correlation),
            but they look...interesting when plotted.
          </p>
    </div>
    
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 p-3 mb-4">
        {error}
      </div>
    {/if}
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="bg-gray-50 p-4 border border-gray-300">
        <h2 class="text-lg font-bold mb-2">Summary Statistics</h2>
        <table class="w-full text-sm">
          <tbody>
            <tr>
              <td class="font-semibold pr-2">Mean X:</td>
              <td class="font-mono">{stats.mean_x !== null ? stats.mean_x.toFixed(2) : 'Loading...'}</td>
            </tr>
            <tr>
              <td class="font-semibold pr-2">Mean Y:</td>
              <td class="font-mono">{stats.mean_y !== null ? stats.mean_y.toFixed(2) : 'Loading...'}</td>
            </tr>
            <tr>
              <td class="font-semibold pr-2">SD X:</td>
              <td class="font-mono">{stats.sd_x !== null ? stats.sd_x.toFixed(2) : 'Loading...'}</td>
            </tr>
            <tr>
              <td class="font-semibold pr-2">SD Y:</td>
              <td class="font-mono">{stats.sd_y !== null ? stats.sd_y.toFixed(2) : 'Loading...'}</td>
            </tr>
            <tr>
              <td class="font-semibold pr-2">Correlation:</td>
              <td class="font-mono">{stats.correlation !== null ? stats.correlation.toFixed(2) : 'Loading...'}</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Spoiler button -->
        <button
          on:click={toggleVisualization}
          disabled={isLoading || !plotBase64}
          class="mt-4 w-full border border-black py-2 px-4 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 font-semibold text-sm transition-colors"
        >
          {isVisualizationRevealed ? 'Hide Visualization' : 'Reveal Visualization'}
        </button>
      </div>
      
      <div class="md:col-span-2 bg-white border border-gray-300 p-4 flex items-center justify-center relative">
        <!-- Spoiler overlay -->
        {#if !isVisualizationRevealed && !isLoading && plotBase64}
          <div class="absolute inset-0  backdrop-blur-xl flex flex-col items-center justify-center text-black p-4 text-center">
            <div class="text-xl font-bold mb-2">🙈</div>
            <p class="text-sm mb-4">Try to imagine what this dataset might look like.</p>
            <button
              on:click={toggleVisualization}
              class="border border-black py-2 px-4 hover:bg-white hover:text-black transition-colors text-sm"
            >
              Reveal Visualization
            </button>
          </div>
        {/if}
        
        {#if isLoading}
          <div class="text-gray-500">Loading visualization...</div>
        {:else if plotBase64}
          <img 
            src="data:image/png;base64,{plotBase64}" 
            alt="Plot of {datasets.find(d => d.id === currentDataset)?.name} dataset" 
            class="max-w-full max-h-[300px]"
          />
        {/if}
      </div>
    </div>
    
    
  </div>
</div>

<style>
  /* Custom styling */
  :global(body) {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
  }
  
  select, button {
    font-family: 'Inter', sans-serif;
  }
  
  .font-mono {
    font-family: 'IBM Plex Mono', monospace;
  }
  
  /* Spinner animation */
  .spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #4D80E6;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style> 