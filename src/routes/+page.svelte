<script>
	const resources = [
		{
			title: 'WEB2025 - Introduction to Making for the Web',
			description:
				'Websites! Designing them, building them and (almost) everything in between. Taught at DA-IICT, 2025',
			link: '/web2025',
			color: 'bg-yellow'
		},
		{
			title: 'CDV2025 - Introduction to Data Visualization',
			description:
				'Introduction to data visualization for design students taught at Chitkara University, 2025',
			link: '/cdv2025',
			color: 'bg-orange'
		},

		{
			title: 'Introduction to QGIS',
			description:
				'Gentle introduction to QGIS for beginners, with a focus on using OpenStreetMap data',
			link: 'https://aman.bh/qgis',
			color: 'bg-green'
		},
		{
			title: 'R with Penguins',
			description: 'A gentle introduction to R and summary statistics with the penguins dataset',
			link: 'https://rwithpenguins.netlify.app/',
			color: 'bg-blue'
		}
	];
</script>

<div class="noise-image mx-auto max-w-[1000px] p-8">
	<header class="border-foreground mb-6 border-b-2 pb-2 text-center">
		<h1 class="text-foreground font-libre-caslon mx-auto mb-1 max-w-2xl text-5xl uppercase">
			AMAN'S GENERAL MISHMASH OF LEARNING RESOURCES
		</h1>
	</header>

	<main class="min-h-[50svh]">
		<div class=" grid grid-cols-1 gap-6">
			{#each resources as resource, i}
				<div class="bg-card border-foreground m-0 overflow-hidden rounded-lg border-2 p-0">
					<div class="p-6 {resource.color}">
						<h2 class="text-foreground font-libre-caslon m-0 text-2xl font-bold">
							{resource.title}
						</h2>
						<p class="font-archivo text-foreground mt-2">{resource.description}</p>
						<a
							href={resource.link}
							class="bg-muted text-foreground border-foreground btn-drop-shadow font-roboto hover:bg-foreground inline-block rounded-md border-2 px-4 py-2 font-bold uppercase transition-colors hover:text-white"
							>View</a
						>
					</div>
				</div>
			{/each}
		</div>
	</main>

	<footer class="border-border text-muted-foreground mt-12 border-t pt-4">
		<p class="font-archivo">
			Licensed under <a
				href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
				target="_blank"
				rel="license noopener noreferrer"
				class="text-primary"
				>CC BY-NC-SA 4.0<img
					class="ml-2 inline-block h-auto w-16"
					src="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc-sa.png"
					alt="CC BY-NC-SA 4.0"
				/></a
			>
		</p>
	</footer>
</div>
