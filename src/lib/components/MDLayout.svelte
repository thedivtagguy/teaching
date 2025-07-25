<script lang="ts">
	import { ExternalLink } from 'lucide-svelte';

	// Import metadata from the markdown file
	interface Metadata {
		title?: string;
		date?: string;
		description?: string;
		published?: boolean;
		section?: string;
		order?: number;
		[key: string]: any; // Allow for additional metadata properties
	}

	export let metadata: Metadata = {};
	export let courseId: string = '';
	export let fileName: string = '';
	export let fileType: 'page' | 'assignment' | 'day' = 'page';

	// Format the date for display
	let formattedDate = '';

	// Check if metadata has a valid date and format it
	$: if (metadata && metadata.date) {
		try {
			const date = new Date(metadata.date);
			formattedDate = date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch (e) {
			formattedDate = metadata.updated; // Fallback to raw date string if parsing fails
		}
	}

	// Generate GitHub edit URL
	$: githubEditUrl = generateGitHubEditUrl(courseId, fileName, fileType);

	/**
	 * Generate GitHub edit URL for the content file
	 */
	function generateGitHubEditUrl(
		courseId: string,
		fileName: string,
		fileType: 'page' | 'assignment' | 'day'
	): string {
		if (!courseId || !fileName) return '';

		const baseUrl = 'https://github.com/thedivtagguy/teaching/blob/main/src/content';

		// Determine the path based on file type
		let filePath = '';
		if (fileType === 'assignment') {
			filePath = `${courseId}/assignments/${fileName}`;
		} else {
			filePath = `${courseId}/${fileName}`;
		}

		// Check which file extension actually exists by trying to access the imported files
		const possiblePaths = [`/src/content/${filePath}.svx`, `/src/content/${filePath}.md`];

		// Use the same import.meta.glob pattern as contentService to check which file exists
		const contentFiles = import.meta.glob(
			[
				'/src/content/**/*.svx',
				'/src/content/**/*.md',
				'!/src/content/**/notes/**',
				'!/src/content/**/templates/**'
			],
			{ eager: true }
		);

		// Find the actual file that exists
		for (const path of possiblePaths) {
			if (contentFiles[path]) {
				const extension = path.endsWith('.svx') ? '.svx' : '.md';
				return `${baseUrl}/${filePath}${extension}`;
			}
		}

		// Fallback to .svx if we can't determine (shouldn't happen in practice)
		return `${baseUrl}/${filePath}.svx`;
	}
</script>

<div class="md-content prose prose-neutral noise-image max-w-none">
	<slot />

	{#if formattedDate || githubEditUrl}
		<div class="page-footer">
			{#if formattedDate}
				<p class="last-updated-text">Last updated: {formattedDate}</p>
			{/if}
			<!-- {#if githubEditUrl}
				<p class="github-edit-link flex items-center gap-1">
					<a href={githubEditUrl} target="_blank" rel="noopener noreferrer"> View on GitHub </a>
				</p>
			{/if} -->
		</div>
	{/if}
</div>

<style>
	:global(.md-content) {
		/* Base styling for markdown content */
		line-height: 1.75;
		font-size: 1.05rem;
	}

	:global(.md-content h1),
	:global(.md-content h2),
	:global(.md-content h3),
	:global(.md-content h4) {
		position: relative; /* Position context for absolute positioning of anchor */
		font-family: var(--font-libre-caslon);
		color: var(--color-neutral);
	}

	:global(.md-content h1) {
		font-weight: 700;
		margin-bottom: 1.5rem;
		font-size: 2.25rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--color-neutral);
	}

	:global(.md-content h2) {
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-size: 1.75rem;
		padding-bottom: 0.25rem;
		border-bottom: 1px solid var(--color-base-300);
	}

	:global(.md-content h3) {
		font-weight: 600;
		margin-top: 1.75rem;
		margin-bottom: 0.75rem;
		font-size: 1.5rem;
	}

	:global(.md-content h4) {
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		font-size: 1.25rem;
		color: var(--color-neutral);
	}

	/* Anchor link styling */
	:global(.anchor-link) {
		display: inline-block;
		margin-left: 0.5rem;
		opacity: 0;
		vertical-align: middle;
		transition: opacity 0.2s;
		color: var(--color-blue) !important;
		text-decoration: none !important;
		border-bottom: none !important;
	}

	:global(.md-content h1:hover .anchor-link),
	:global(.md-content h2:hover .anchor-link),
	:global(.md-content h3:hover .anchor-link),
	:global(.md-content h4:hover .anchor-link) {
		opacity: 0.8;
	}

	:global(.anchor-link:hover) {
		opacity: 1 !important;
	}

	:global(.link-icon) {
		display: inline-block;
		vertical-align: middle;
	}

	/* Content styling */
	:global(.md-content p:not(.important p, .note p, .warning p)) {
		font-family: var(--font-archivo);
		margin-bottom: 1.25rem;
		color: var(--color-neutral);
	}

	:global(.md-content strong) {
		font-weight: 600;
		color: var(--color-neutral);
	}

	:global(.md-content em) {
		font-style: italic;
		color: var(--color-neutral);
	}

	:global(.md-content ul, .md-content ol) {
		padding-left: 1.5rem;
		margin-bottom: 1.5rem;
	}

	:global(.md-content ul) {
		list-style-type: disc;
	}

	:global(.md-content ol) {
		list-style-type: decimal;
	}

	:global(.md-content li) {
		font-family: var(--font-archivo);
		margin-bottom: 0.5rem;
		padding-left: 0.25rem;
	}

	:global(.md-content li:last-child) {
		margin-bottom: 0;
	}

	:global(.md-content li > ul, .md-content li > ol) {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}

	:global(.md-content a) {
		color: var(--color-blue);
		text-decoration: none;
		border-bottom: 1px solid var(--color-blue);
		transition:
			color 0.2s,
			border-bottom-color 0.2s;
	}

	:global(.md-content a:hover) {
		color: var(--color-purple);
		border-bottom-color: var(--color-purple);
	}

	:global(.md-content blockquote) {
		border-left: 4px solid var(--color-yellow);
		padding-left: 1rem;
		margin-left: 0;
		margin-right: 0;
		margin-bottom: 1.5rem;
		font-style: italic;
		color: var(--color-neutral);
		background-color: var(--color-base-200);
		padding: 1rem 1.5rem;
		border-radius: 0.25rem;
		border: 2px solid var(--color-neutral);
		box-shadow: var(--shadow-btn-drop-shadow);
	}

	:global(.md-content blockquote p:last-child) {
		margin-bottom: 0;
	}

	:global(.md-content code) {
		font-family: var(--font-fira);
		background-color: var(--color-base-200);
		padding: 0.2em 0.4em;
		border-radius: 3px;
		font-size: 0.875em;
		color: var(--color-neutral);
		border: 1px solid var(--color-base-300);
	}

	:global(.md-content pre) {
		background-color: var(--color-neutral);
		padding: 1.25rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin-bottom: 1.75rem;
		border: 2px solid var(--color-neutral);
		box-shadow: var(--shadow-btn-drop-shadow);
	}

	:global(.md-content pre code) {
		background-color: transparent;
		padding: 0;
		font-size: 0.9em;
		border: none;
		color: var(--color-base-100);
		line-height: 1.6;
	}

	/* Special definition styles for educational content */
	:global(.md-content dl) {
		margin-bottom: 1.5rem;
	}

	:global(.md-content dt) {
		font-weight: 600;
		font-family: var(--font-archivo);
		color: var(--color-neutral);
		margin-bottom: 0.5rem;
	}

	:global(.md-content dd) {
		margin-left: 1.5rem;
		margin-bottom: 1rem;
		font-family: var(--font-archivo);
	}

	/* Highlight important information */
	:global(.md-content .important),
	:global(.md-content .note),
	:global(.md-content .warning) {
		padding: 1rem;

		border-radius: 0.5rem;
		border: 2px solid var(--color-neutral);
		box-shadow: var(--shadow-btn-drop-shadow);
	}

	:global(.md-content .important) {
		background-color: var(--color-blue);
		border-left: 4px solid var(--color-neutral);
	}

	:global(.md-content .note) {
		background-color: var(--color-sage);
		border-left: 4px solid var(--color-neutral);
		color: var(--color-neutral);
	}

	:global(.md-content .warning) {
		background-color: var(--color-orange);
		border-left: 4px solid var(--color-neutral);
		color: var(--color-neutral);
	}

	/* Tables */
	:global(.md-content table) {
		width: 100%;
		margin-bottom: 1.25rem;
		border-collapse: collapse;
		border: 1px solid var(--color-base-300);
		font-size: 0.95rem;
		font-family: var(--font-archivo);
	}

	:global(.md-content th) {
		background-color: var(--color-base-200);
		padding: 0.5rem 0.75rem;
		text-align: left;
		font-weight: 600;
		font-family: var(--font-archivo);
		border-bottom: 1px solid var(--color-base-300);
		color: var(--color-neutral);
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	:global(.md-content td) {
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--color-base-200);
		line-height: 1.4;
	}

	:global(.md-content tr:last-child td) {
		border-bottom: none;
	}

	:global(.md-content tr:hover) {
		background-color: var(--color-base-100);
	}

	/* Images */
	:global(.md-content img) {
		max-width: 100%;
		height: auto;
		margin: 1.5rem auto;
		border-radius: 0.5rem;
		display: block;
		box-shadow: var(--shadow-sm);
	}

	/* Horizontal rule */
	:global(.md-content hr) {
		margin: 2rem 0;
		border: 0;
		height: 1px;
		background-color: var(--color-border);
	}

	/* Special elements for educational content */
	:global(.md-content details) {
		margin-bottom: 1.5rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
		padding: 0.5rem 1rem;
	}

	:global(.md-content summary) {
		font-weight: 600;
		cursor: pointer;
		padding: 0.5rem 0;
		color: var(--color-blue);
	}

	:global(.md-content details[open] summary) {
		margin-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	/* Page footer styling */
	:global(.page-footer) {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-base-300);
		font-size: 0.8rem;
		color: var(--color-base-500);
		font-style: italic;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	:global(.page-footer p) {
		margin-bottom: 0;
		font-family: var(--font-archivo);
		color: var(--color-base-500);
		font-size: 0.6rem;
	}

	:global(.last-updated-text) {
		text-align: left;
	}

	:global(.github-edit-link) {
		text-align: right;
		margin-left: auto;
	}

	:global(.github-edit-link a) {
		color: var(--color-blue) !important;
		text-decoration: none !important;
		border-bottom: 1px solid var(--color-blue) !important;
		font-style: normal;
		transition:
			color 0.2s,
			border-bottom-color 0.2s;
	}

	:global(.github-edit-link a:hover) {
		color: var(--color-purple) !important;
		border-bottom-color: var(--color-purple) !important;
	}

	/* Responsive styling */
	@media (max-width: 640px) {
		:global(.page-footer) {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		:global(.last-updated-text),
		:global(.github-edit-link) {
			text-align: left;
			margin-left: 0;
		}
	}
</style>
