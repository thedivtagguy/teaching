<script>
  export let title = 'Data Visualization Course';
  export let date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  export let description = '';
  export let courseId = '';
  export let type = 'page'; // 'page', 'assignment', 'day'
  
  // Color theme based on the theme variables in app.css
  $: bgColor = type === 'assignment' ? 'var(--course-blue)' : // blue
              type === 'day' ? 'var(--course-green)' : // green
              'var(--course-base-100)'; // default light
  
  $: textColor = (type === 'assignment' || type === 'day') ? 
                 'var(--course-base-100)' : 'var(--course-neutral)'; // white or dark
  
  $: accentColor = type === 'assignment' ? 'var(--course-yellow)' : // yellow
                  type === 'day' ? 'var(--course-orange)' : // orange
                  'var(--course-sage)'; // sage
</script>

<div 
  style:width="1200px"
  style:height="630px"
  style:background-color={bgColor}
  style:color={textColor}
  style:font-family="'LibreCaslonCondensed', serif"
  style:display="flex"
  style:flex-direction="column"
  style:padding="60px"
  style:position="relative"
  style:overflow="hidden"
>
  <!-- Noise texture overlay - matching noise-image::after in app.css -->
  <div 
    style:position="absolute" 
    style:inset="0" 
    style:background="url('data:image/svg+xml,%3Csvg viewBox=%270 0 245 245%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noiseFilter%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%278.51%27 numOctaves=%2710%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')"
    style:mix-blend-mode="overlay"
    style:opacity="0.3"
  ></div>
  
  <!-- Header with logo and courseId if available -->
  <div style:display="flex" style:justify-content="space-between" style:align-items="center">
    {#if courseId}
      <div 
        style:font-size="28px"
        style:font-weight="bold"
        style:letter-spacing="1px"
        style:text-transform="uppercase"
        style:margin-bottom="20px"
        style:color={accentColor}
        style:border-bottom="3px solid {accentColor}"
        style:padding-bottom="4px"
      >
        {courseId.toUpperCase()}
      </div>
    {/if}
    
    <!-- Visual accent element for page corner -->
    <div
      style:width="120px"
      style:height="120px"
      style:background-color={accentColor}
      style:opacity="0.4"
      style:position="absolute"
      style:top="0"
      style:right="0"
      style:transform="translate(50%, -50%) rotate(45deg)"
    ></div>
  </div>
  
  <!-- Content type indicator - styled like .black-bento -->
  {#if type !== 'page'}
    <div 
      style:font-size="24px"
      style:font-weight="bold"
      style:text-transform="uppercase"
      style:display="inline-block"
      style:padding="8px 16px"
      style:margin-bottom="30px"
      style:background-color="var(--course-neutral)"
      style:color="var(--course-base-100)"
      style:border-radius="1rem"
      style:letter-spacing="0.5px"
      style:font-family="'Roboto Condensed', sans-serif"
      style:box-shadow="0 2px 0 0 rgba(43, 43, 43, 0.6)"
    >
      {type === 'assignment' ? 'Assignment' : 'Day'}
    </div>
  {/if}
  
  <!-- Main title with highlight effect -->
  <div style:position="relative" style:z-index="1" style:margin-top="auto">
    <h1 
      style:font-size="80px"
      style:font-weight="bold"
      style:line-height="1.1"
      style:margin-bottom="32px"
      style:max-width="90%"
      style:position="relative"
    >
      {title}
      <!-- Decorative underline inspired by .highlight in app.css -->
      <div
        style:content="''"
        style:display="block"
        style:width="60%"
        style:height="12px"
        style:position="absolute"
        style:bottom="-15px"
        style:left="0"
        style:background-color={accentColor}
        style:opacity="0.6"
        style:transform="rotate(-0.5deg)"
      ></div>
    </h1>
  </div>
  
  <!-- Description if available - with Archivo font -->
  {#if description}
    <p 
      style:font-size="32px"
      style:line-height="1.4"
      style:margin-bottom="auto"
      style:max-width="80%"
      style:opacity="0.9"
      style:font-family="'Archivo Variable', sans-serif"
    >
      {description}
    </p>
  {/if}
  
  <!-- Footer with date and branding -->
  <div 
    style:display="flex"
    style:justify-content="space-between"
    style:align-items="center"
    style:margin-top="60px"
    style:padding-top="20px"
    style:border-top="1px solid {textColor === 'var(--course-base-100)' ? 'rgba(255,255,255,0.2)' : 'rgba(43,43,43,0.2)'}"
  >
    <div
      style:font-size="24px"
      style:font-family="'Archivo Variable', sans-serif"
    >
      {date}
    </div>
    <div 
      style:font-weight="bold"
      style:font-size="28px"
      style:position="relative"
      style:padding="6px 12px"
      style:border-radius="6px"
      style:box-shadow="0 2px 0 0 rgba(43, 43, 43, 0.6)"
      style:background-color={accentColor}
      style:color="var(--course-neutral)"
    >
     teaching.aman.bh
    </div>
  </div>
</div>