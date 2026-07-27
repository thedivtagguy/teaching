<script>
	import { onMount } from 'svelte';
	import { Search, FileText, Play, BookOpen, Shuffle } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';

	export let courseId;

	let library = [];
	let searchTerm = '';
	let shuffleSeed = 0;

	// Course accent colors, cycled per-domain so rows from the same site match
	const ACCENTS = ['#E8C85A', '#E8845A', '#8FA9E0', '#92DE86', '#949B80', '#C98A8A', '#8B8AB8'];

	onMount(async () => {
		let items = [];
		try {
			const response = await fetch(`/${courseId}/data/library.json`);
			const data = await response.json();
			// Handle BetterBibTeX JSON format which has items nested under "items" key
			items = data.items || data;
		} catch (error) {
			console.warn('Could not load library.json:', error);
			return;
		}

		let meta = {};
		try {
			const response = await fetch(`/${courseId}/data/library-meta.json`);
			meta = await response.json();
		} catch (error) {
			console.warn('Could not load library-meta.json (run scripts/enrich-library.mjs):', error);
		}

		// Dedupe (the Zotero export has a few exact duplicates) and attach metadata
		const seen = new Set();
		library = items
			.filter((item) => {
				const key = item.url || item.title;
				if (seen.has(key)) return false;
				seen.add(key);
				return true;
			})
			.map((item) => ({ ...item, meta: (item.url && meta[item.url]) || {} }));
	});

	function getKind(item) {
		if (item.meta.kind === 'video' || item.itemType === 'videoRecording') return 'video';
		if (
			item.meta.kind === 'pdf' ||
			/journalArticle|conferencePaper|bookSection|attachment/.test(item.itemType || '')
		)
			return 'pdf';
		return 'article';
	}

	function getTitle(item) {
		// Prefer the fetched page title when the Zotero one is a stub
		if (
			item.meta.title &&
			(!item.title || /^figma$|just a moment|untitled|^\(\d+\)/i.test(item.title))
		)
			return item.meta.title;
		return item.title || item.meta.title || 'Untitled';
	}

	function getDescription(item) {
		return item.abstractNote || item.meta.description || '';
	}

	function getDomain(item) {
		if (item.meta.domain) return item.meta.domain;
		try {
			return new URL(item.url).hostname.replace(/^www\./, '');
		} catch {
			return '';
		}
	}

	function accentFor(item) {
		const key = getDomain(item) || getTitle(item);
		let hash = 0;
		for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
		return ACCENTS[Math.abs(hash) % ACCENTS.length];
	}

	function formatAuthors(creators) {
		if (!creators || creators.length === 0) return '';
		return creators
			.map((creator) => `${creator.firstName || ''} ${creator.lastName || ''}`.trim())
			.filter((name) => name)
			.join(', ');
	}

	function getByline(item) {
		return formatAuthors(item.creators) || item.meta.authorName || '';
	}

	function formatDate(date) {
		if (!date) return '';
		const year = new Date(date).getFullYear();
		return Number.isNaN(year) ? '' : year;
	}

	function hideBrokenImage(event) {
		event.currentTarget.style.display = 'none';
	}

	function shuffle() {
		shuffleSeed = Math.random();
	}

	function shuffleHash(item) {
		const key = getTitle(item) + shuffleSeed;
		let x = 0;
		for (let i = 0; i < key.length; i++) x = (x * 31 + key.charCodeAt(i)) | 0;
		return x;
	}

	$: filteredLibrary = library
		.filter((item) => {
			const q = searchTerm.toLowerCase();
			return (
				!q ||
				getTitle(item).toLowerCase().includes(q) ||
				getByline(item).toLowerCase().includes(q) ||
				getDescription(item).toLowerCase().includes(q) ||
				getDomain(item).toLowerCase().includes(q) ||
				(item.publicationTitle && item.publicationTitle.toLowerCase().includes(q))
			);
		})
		.sort((a, b) =>
			shuffleSeed ? shuffleHash(a) - shuffleHash(b) : getTitle(a).localeCompare(getTitle(b))
		);
</script>

<div class="library">
	<div class="library-intro">
		{library.length} readings, sites, and videos collected for {courseId.toUpperCase()}.
	</div>

	<div class="library-toolbar">
		<div class="library-search">
			<Search class="library-search-icon h-4 w-4" />
			<Input
				type="text"
				placeholder="Search titles, authors, sites…"
				class="font-archivo pl-9"
				bind:value={searchTerm}
			/>
		</div>
		<button class="library-shuffle" on:click={shuffle} title="Shuffle the shelf">
			<Shuffle class="h-4 w-4" />
			<span>Shuffle</span>
		</button>
	</div>

	{#if library.length === 0}
		<div class="library-empty">No library items found. Check back soon!</div>
	{:else if filteredLibrary.length === 0}
		<div class="library-empty">
			Nothing matches “{searchTerm}”.
			<button class="library-clear" on:click={() => (searchTerm = '')}>Clear search</button>
		</div>
	{:else}
		{#if searchTerm}
			<div class="library-count">
				{filteredLibrary.length}
				{filteredLibrary.length === 1 ? 'item' : 'items'}
			</div>
		{/if}

		<div class="library-list">
			{#each filteredLibrary as item (item.uri || item.url || item.title)}
				{@const kind = getKind(item)}
				{@const description = getDescription(item)}
				{@const byline = getByline(item)}
				{@const year = formatDate(item.date)}
				{@const domain = getDomain(item)}
				<a class="library-row" href={item.url} target="_blank" rel="noopener noreferrer">
					<div
						class="library-thumb"
						style={item.meta.image ? '' : `background: ${accentFor(item)}`}
					>
						{#if item.meta.image}
							<img src={item.meta.image} alt="" loading="lazy" on:error={hideBrokenImage} />
						{:else if kind === 'pdf'}
							<FileText class="h-4 w-4" />
						{:else if kind === 'video'}
							<Play class="h-4 w-4" />
						{:else}
							<BookOpen class="h-4 w-4" />
						{/if}
					</div>

					<div class="library-text">
						<div class="library-title">{getTitle(item)}</div>
						<div class="library-meta">
							{#if byline}<span>{byline}</span>{/if}
							{#if domain}<span>{domain}</span>{:else if item.publicationTitle}<span
									>{item.publicationTitle}</span
								>{/if}
							{#if year}<span>{year}</span>{/if}
						</div>
						{#if description}
							<div class="library-desc">{description}</div>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.library-intro {
		font-family: var(--font-archivo);
		font-size: 1rem;
		color: var(--color-muted-foreground);
		margin-bottom: 1.25rem;
	}

	.library-toolbar {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.library-search {
		position: relative;
		flex: 1;
	}

	.library-search :global(.library-search-icon) {
		position: absolute;
		left: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--color-muted-foreground);
		z-index: 10;
	}

	.library-shuffle {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0 0.875rem;
		font-family: var(--font-archivo);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-foreground);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: background-color 150ms var(--ease-out);
	}

	.library-shuffle:hover {
		background: var(--color-muted);
	}

	.library-count {
		font-family: var(--font-archivo);
		font-size: 0.8125rem;
		color: var(--color-muted-foreground);
		margin-bottom: 0.75rem;
	}

	.library-empty {
		font-family: var(--font-archivo);
		text-align: center;
		padding: 2.5rem 1rem;
		color: var(--color-muted-foreground);
		background: var(--color-muted);
		border-radius: var(--radius-lg);
	}

	.library-clear {
		font-family: var(--font-archivo);
		text-decoration: underline;
		color: var(--color-foreground);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		margin-left: 0.5rem;
	}

	.library-list {
		display: flex;
		flex-direction: column;
	}

	.library-row {
		display: grid;
		grid-template-columns: 4.5rem 1fr;
		gap: 1rem;
		align-items: start;
		padding: 0.875rem 0.75rem;
		margin: 0 -0.75rem;
		text-decoration: none;
		transition: background-color 150ms var(--ease-out);
	}

	.library-row:hover {
		background: var(--color-muted);
	}

	.library-thumb {
		width: 4.5rem;
		height: 3.375rem;
		border-radius: var(--radius-sm);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgb(43 43 43 / 0.55);
		background: var(--color-muted);
		margin-top: 0.125rem;
	}

	.library-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		margin: 0;
	}

	.library-text {
		min-width: 0;
	}

	.library-title {
		font-family: var(--font-roboto);
		font-size: 1.0625rem;
		font-weight: 700;
		line-height: 1.35;
		letter-spacing: 0;
		color: var(--color-foreground);
	}

	.library-row:hover .library-title {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.library-meta {
		font-family: var(--font-archivo);
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--color-muted-foreground);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-top: 0.125rem;
	}

	.library-meta span + span::before {
		content: '·';
		margin: 0 0.4rem;
		opacity: 0.5;
	}

	.library-desc {
		font-family: var(--font-archivo);
		font-size: 0.875rem;
		line-height: 1.55;
		color: var(--color-foreground);
		opacity: 0.72;
		margin-top: 0.375rem;
		max-width: 62ch;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media (max-width: 640px) {
		.library-row {
			grid-template-columns: 3rem 1fr;
			gap: 0.75rem;
		}

		.library-thumb {
			width: 3rem;
			height: 2.25rem;
		}

		.library-desc {
			display: none;
		}
	}
</style>
