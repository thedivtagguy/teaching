<script lang="ts">
  import { onMount } from 'svelte';
  import { WebR } from 'webr';
  
  // Define the type for webR
  let webR: any;
  let isWebRReady = false;
  let dataInput = "1,2,3,4,5,6,7,8,9,10";
  let results: { mean: number | null, median: number | null, mode: number | null } = { mean: null, median: null, mode: null };
  let isLoading = false;
  let error: string | null = null;
  
  // Function to calculate statistics
  async function calculateStats() {
    if (!isWebRReady) return;
    
    isLoading = true;
    error = null;
    
    try {
      // Clean input and convert to numbers
      const dataArray = dataInput.split(',')
        .map(x => x.trim())
        .filter(x => x !== '')
        .map(x => Number(x));
      
      if (dataArray.length === 0 || dataArray.some(isNaN)) {
        throw new Error("Please enter valid numbers separated by commas");
      }
      
      // Calculate statistics using webR
      const statsResult = await webR.evalR(`
        # Create data vector
        data <- c(${dataArray.toString()})
        
        # Calculate statistics
        mean_val <- mean(data)
        median_val <- median(data)
        
        # Calculate mode (R doesn't have a built-in mode function)
        getMode <- function(v) {
          uniqv <- unique(v)
          uniqv[which.max(tabulate(match(v, uniqv)))]
        }
        mode_val <- getMode(data)
        
        # Return as simple numeric values
        c(mean_val, median_val, mode_val)
      `);
      
      // Get values as a JavaScript array of numbers
      const values = await statsResult.toArray();
      
      // Update results with values
      results = {
        mean: Number(values[0]),
        median: Number(values[1]),
        mode: Number(values[2])
      };
      
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
  
  onMount(async () => {
    try {
      // Initialize webR
      webR = new WebR();
      await webR.init();
      
      // No additional packages required for this component
      
      isWebRReady = true;
      
      // Calculate initial stats with the default data
      calculateStats();
      
    } catch (e: unknown) {
      if (e instanceof Error) {
        error = `Failed to initialize webR: ${e.message}`;
      } else {
        error = `Failed to initialize webR: ${String(e)}`;
      }
    }
  });
</script>

<div class="font-inter bg-gray-100 text-black leading-relaxed p-5">
  <div class="max-w-3xl mx-auto bg-white border border-black p-5">
    <h1 class="text-2xl font-bold border-b pb-2 mb-4">Measures of Central Tendency</h1>
    
    <div class="mb-6">
      <label for="data-input" class="block font-bold mb-1">Enter data (comma-separated numbers):</label>
      <div class="flex gap-2">
        <input 
          id="data-input"
          bind:value={dataInput} 
          type="text" 
          class="border border-black p-2 flex-grow"
          placeholder="e.g. 3,5,6,7,7,9,8,7,5,6,4,5,3,1"
        />
        <button 
          on:click={calculateStats} 
          disabled={!isWebRReady || isLoading}
          class="bg-black text-white px-4 py-2 hover:bg-gray-800 disabled:bg-gray-400"
        >
          Calculate
        </button>
      </div>
    </div>
    
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 p-3 mb-4">
        {error}
      </div>
    {/if}
    
    <div class="grid grid-cols-1 gap-px bg-black border border-black mb-4">
      <div class="bg-white p-4">
        <div class="text-lg font-bold mb-2">Mean</div>
        <div class="mb-2 text-sm">The arithmetic average - sum of all values divided by the number of values.</div>
        {#if isLoading}
          <div class="text-gray-500">Calculating...</div>
        {:else if results.mean !== null}
          <div class="font-mono text-xl">{results.mean.toFixed(2)}</div>
        {/if}
      </div>
      
      <div class="bg-white p-4">
        <div class="text-lg font-bold mb-2">Median</div>
        <div class="mb-2 text-sm">The middle value when data is arranged in order.</div>
        {#if isLoading}
          <div class="text-gray-500">Calculating...</div>
        {:else if results.median !== null}
          <div class="font-mono text-xl">{results.median.toFixed(2)}</div>
        {/if}
      </div>
      
      <div class="bg-white p-4">
        <div class="text-lg font-bold mb-2">Mode</div>
        <div class="mb-2 text-sm">The most frequent value in the dataset.</div>
        {#if isLoading}
          <div class="text-gray-500">Calculating...</div>
        {:else if results.mode !== null}
          <div class="font-mono text-xl">{results.mode}</div>
        {/if}
      </div>
    </div>
    
    <div class="mt-6 bg-gray-100 p-4 border border-gray-300">
      <h2 class="text-xl font-bold mb-2">How to interpret these measures:</h2>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Mean:</strong> Best used when the data is fairly symmetrical without extreme outliers.</li>
        <li><strong>Median:</strong> More suitable for skewed distributions as it's not affected by extreme values.</li>
        <li><strong>Mode:</strong> Helpful for identifying the most common value, especially in categorical data.</li>
      </ul>
      <p class="mt-3 text-sm">Try changing the values to see how outliers affect each measure differently.</p>
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
  
  input, button {
    font-family: 'Inter', sans-serif;
  }
  
  .font-mono {
    font-family: 'IBM Plex Mono', monospace;
  }
</style> 