

  <svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  </svelte:head>
  
  <div class="font-inter bg-gray-100 text-black leading-relaxed p-5">
    <div class="max-w-4xl mx-auto bg-white border border-black">
      <!-- Header -->
      <div class="p-4 border-b border-black">
        <div class="h-2 flex mb-4 mt-1">
          <div class="h-full flex-1 bg-red-600"></div>
          <div class="h-full flex-1 bg-green-700"></div>
          <div class="h-full flex-1 bg-blue-600"></div>
          <div class="h-full flex-1 bg-yellow-500"></div>
          <div class="h-full flex-1 bg-pink-600"></div>
          <div class="h-full flex-1 bg-black"></div>
        </div>
        
        <div class="text-base font-bold">The Proof is in the Plotting™ Standard Recipe</div>
      </div>
      
      <!-- Recipe Info Grid -->
      <div class="grid grid-cols-2 gap-px bg-black border border-black mx-4 my-5">
        <div class="bg-white p-2.5">
          <div class="text-xs font-bold mb-1">Prep Time</div>
          <div class="text-xs font-mono">30 mins</div>
        </div>
        <div class="bg-white p-2.5">
          <div class="text-xs font-bold mb-1">Cook Time</div>
          <div class="text-xs font-mono">1-2 hours (and/or a lifetime)</div>
        </div>
        <div class="bg-white p-2.5">
          <div class="text-xs font-bold mb-1">Difficulty</div>
          <div class="text-xs font-mono">Sometimes</div>
        </div>
        <div class="bg-white p-2.5">
          <div class="text-xs font-bold mb-1">Serves</div>
          <div class="text-xs font-mono">Absolutely</div>
        </div>
      </div>
      
      <!-- Recipe Steps Section -->
      <div class="mx-4 mb-8 border border-black">
        <div class="p-2.5 border-b border-black font-bold bg-gray-100 text-sm">Recipe Steps</div>
        
        <div class="grid grid-cols-[1fr_3fr] gap-px bg-black">
          <div class="bg-white p-2.5 font-bold flex items-center justify-center text-xl">01</div>
          <div class="bg-white p-2.5 flex flex-col">
            <div class="font-bold text-sm mb-2 uppercase">Get the Ingredients Together</div>
            <ul class="list-none text-xs">
              <li class="mb-1 relative pl-4">Learn to shop for data</li>
              <li class="mb-1 relative pl-4">Appreciate how it was grown in the first place</li>
              <li class="mb-1 relative pl-4">What does data look like and why should we care?</li>
              <li class="mb-1 relative pl-4">How to spot a good <span class="line-through">vegetable</span> variable</li>
            </ul>
          </div>
          
          <div class="bg-white p-2.5 font-bold flex items-center justify-center text-xl">02</div>
          <div class="bg-white p-2.5 flex flex-col">
            <div class="font-bold text-sm mb-2 uppercase">Wash, Clean, Peel, Grate, Fry</div>
            <ul class="list-none text-xs">
              <li class="mb-1 relative pl-4">Rapidly make different kinds of charts and tables</li>
              <li class="mb-1 relative pl-4">Large pieces? Filtering? Tadka?</li>
              <li class="mb-1 relative pl-4">Copy first, then add your own masala</li>
              <!-- <li class="mb-1 relative pl-4">Just like onions, some data needs to be fried till transparent</li> -->
            </ul>
          </div>
          
          <div class="bg-white p-2.5 font-bold flex items-center justify-center text-xl">03</div>
          <div class="bg-white p-2.5 flex flex-col">
            <div class="font-bold text-sm mb-2 uppercase">Sample and Taste</div>
            <ul class="list-none text-xs">
              <li class="mb-1 relative pl-4">Try to Answer your Questions with Graphs, Tables, or Plain Numbers</li>
              <li class="mb-1 relative pl-4">Does it need more salt, or did you end up with khichdi and want to start over?</li>
            </ul>
          </div>
          
          <div class="bg-white p-2.5 font-bold flex items-center justify-center text-xl">04</div>
          <div class="bg-white p-2.5 flex flex-col">
            <div class="font-bold text-sm mb-2 uppercase">Is this an idiot sandwich?</div>
            <ul class="list-none text-xs">
              <li class="mb-1 relative pl-4">Use your Sense of Surprise™. Aha moment? No aha moment? <br/> Is a different chart what you need?</li>
              <li class="mb-1 relative pl-4">Develop intuition that matches data and chart types</li>
              <li class="mb-1 relative pl-4">Does <i>haldi</i> really add flavour to something that wanted to be a pizza?</li>
            </ul>
          </div>
          
          <div class="bg-white p-2.5 font-bold flex items-center justify-center text-xl">05</div>
          <div class="bg-white p-2.5 flex flex-col">
            <div class="font-bold text-sm mb-2 uppercase">Lay the Table</div>
            <ul class="list-none text-xs">
              <li class="mb-1 relative pl-4">Tell the Stories: What is the Big Idea? Why should someone care?</li>
              <li class="mb-1 relative pl-4"><span class="italic">Melody itni chocolatey kyun hai?</span></li>
              <li class="mb-1 relative pl-4">Garnish the graphs with text and insights</li>
              <li class="mb-1 relative pl-4">Plate these to create crisp and readable graphics that you can share</li>
            </ul>
          </div>
          
          <div class="bg-white p-2.5 font-bold flex items-center justify-center text-xl">07</div>
          <div class="bg-white p-2.5 flex flex-col">
            <div class="font-bold text-sm mb-2 uppercase">Lather, rinse, repeat</div>
            <ul class="list-none text-xs">
              <li class="mb-1 relative pl-4">Practice, practice, practice. Different vegetables, different dishes, plated differently, served to different people.</li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Notes -->
      <div class="mx-4 mb-8 text-xs leading-relaxed">
        For best results, follow the steps in order but don't be afraid to go back and adjust previous steps as you learn more about your data. <br/> Unless you're a cat, some curiosity is all you need.
      </div>
      
      <!-- Footer -->
      <div class="p-4 text-xs border-t border-black">
        <div class="flex justify-between text-[10px] mt-2.5">
          <div>By <a class="underline" href="https://av-quarto.netlify.app/"> Arvind Venkatadri</a></div>
          <div class="bg-green-700 text-white px-1 py-0.5 text-[10px]">[v0.0.1]</div>
        </div>
      </div>
    </div>
  </div>
  
  <style>
    /* Custom styles that aren't easily achieved with Tailwind */
    :global(body) {
      font-family: 'Inter', sans-serif;
    }
    
    :global(.font-mono) {
      font-family: 'IBM Plex Mono', monospace;
    }
    
    :global(.font-inter) {
      font-family: 'Inter', sans-serif;
    }
  
    
    /* Color classes matching the original */
    :global(.bg-red-600) {
      background-color: #f03;
    }
    
    :global(.bg-green-700) {
      background-color: #090;
    }
    
    :global(.bg-blue-600) {
      background-color: #03f;
    }
    
    :global(.bg-yellow-500) {
      background-color: #fc0;
    }
    
    :global(.bg-pink-600) {
      background-color: #f09;
    }
    
    /* Exact spacing matching */
    :global(.leading-relaxed) {
      line-height: 1.4;
    }
  </style>