<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import {
		ExternalLink,
		Users,
		MessageCircle,
		AlertCircle,
		RefreshCw,
		Github
	} from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';

	// Type definitions
	interface Issue {
		id: number;
		title: string;
		html_url: string;
		created_at: string;
		updated_at: string;
		state: 'open' | 'closed';
		user: {
			login: string;
			avatar_url: string;
		};
		repository: {
			name: string;
			full_name: string;
		};
		comments_count: number;
		unique_commenters: number;
	}

	interface Repository {
		name: string;
		full_name: string;
		open_issues_count: number;
	}

	// Get data from page load
	$: courseId = $page.params.courseId;
	$: meta = $page.data?.meta || {};
	$: githubPrefix = meta.githubPrefix || '';
	$: classStrength = meta.classStrength || 0;

	// Component state
	let loading = false;
	let error: string | null = null;
	let issues: Issue[] = [];
	let repositories: Repository[] = [];
	let lastUpdated: Date | null = null;

	// GitHub API configuration
	const GITHUB_API_BASE = 'https://api.github.com';
	const GITHUB_ORG = 'open-making'; // Based on the example URL provided

	// Fetch repositories with the githubPrefix
	async function fetchRepositories(): Promise<Repository[]> {
		const response = await fetch(`${GITHUB_API_BASE}/orgs/${GITHUB_ORG}/repos?per_page=100`);
		if (!response.ok) {
			throw new Error(`Failed to fetch repositories: ${response.status}`);
		}

		const repos = await response.json();
		return repos
			.filter((repo: any) => repo.name.startsWith(githubPrefix))
			.map((repo: any) => ({
				name: repo.name,
				full_name: repo.full_name,
				open_issues_count: repo.open_issues_count
			}));
	}

	// Fetch issues from a specific repository
	async function fetchIssuesFromRepo(repoName: string): Promise<Issue[]> {
		const response = await fetch(
			`${GITHUB_API_BASE}/repos/${GITHUB_ORG}/${repoName}/issues?state=open&per_page=100`
		);
		if (!response.ok) {
			throw new Error(`Failed to fetch issues from ${repoName}: ${response.status}`);
		}

		const issues = await response.json();
		const issuesWithCommentData = await Promise.all(
			issues.map(async (issue: any) => {
				// Fetch comments to count unique commenters
				const commentsResponse = await fetch(
					`${GITHUB_API_BASE}/repos/${GITHUB_ORG}/${repoName}/issues/${issue.number}/comments`
				);
				let uniqueCommenters = 0;

				if (commentsResponse.ok) {
					const comments = await commentsResponse.json();
					const commenters = new Set();

					// Include the issue author as a commenter (exclude instructor)
					if (issue.user.login !== 'thedivtagguy') {
						commenters.add(issue.user.login);
					}

					// Add all comment authors (exclude instructor)
					comments.forEach((comment: any) => {
						if (comment.user.login !== 'thedivtagguy') {
							commenters.add(comment.user.login);
						}
					});

					uniqueCommenters = commenters.size;
				}

				return {
					id: issue.id,
					title: issue.title,
					html_url: issue.html_url,
					created_at: issue.created_at,
					updated_at: issue.updated_at,
					state: issue.state,
					user: {
						login: issue.user.login,
						avatar_url: issue.user.avatar_url
					},
					repository: {
						name: repoName,
						full_name: `${GITHUB_ORG}/${repoName}`
					},
					comments_count: issue.comments,
					unique_commenters: uniqueCommenters
				};
			})
		);

		return issuesWithCommentData;
	}

	// Fetch all issues from all matching repositories
	async function fetchAllIssues(): Promise<void> {
		try {
			loading = true;
			error = null;

			// First, fetch all repositories with the prefix
			const repos = await fetchRepositories();
			repositories = repos;

			// Then fetch issues from each repository
			const allIssues: Issue[] = [];
			for (const repo of repos) {
				try {
					const repoIssues = await fetchIssuesFromRepo(repo.name);
					allIssues.push(...repoIssues);
				} catch (err) {
					console.warn(`Failed to fetch issues from ${repo.name}:`, err);
				}
			}

			// Sort issues by creation date (newest first)
			issues = allIssues.sort(
				(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
			);
			lastUpdated = new Date();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to fetch issues';
		} finally {
			loading = false;
		}
	}

	// Format date for display
	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// Calculate engagement percentage
	function getEngagementPercentage(uniqueCommenters: number): number {
		if (classStrength === 0) return 0;
		return Math.round((uniqueCommenters / classStrength) * 100);
	}

	// Get engagement status color
	function getEngagementColor(percentage: number): string {
		if (percentage >= 75) return 'text-green-600 bg-green-50 border-green-200';
		if (percentage >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
		if (percentage >= 25) return 'text-orange-600 bg-orange-50 border-orange-200';
		return 'text-red-600 bg-red-50 border-red-200';
	}

	// Load issues on component mount
	onMount(() => {
		if (githubPrefix) {
			fetchAllIssues();
		}
	});
</script>

<svelte:head>
	<title>Admin Dashboard | {courseId.toUpperCase()}</title>
</svelte:head>

<div class="noise-image mx-auto max-w-6xl px-4 pb-16 md:px-0">
	<!-- Header -->
	<div class="border-foreground mb-8 border-b-2 pb-6">
		<div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
			<div class="flex flex-col">
				<h1 class="font-libre-caslon text-foreground m-0 flex items-center gap-3 p-0 text-4xl">
					<Users class="h-10 w-10" />
					Admin Dashboard
				</h1>
				<p class="text-muted-foreground font-archivo m-0 p-0 text-lg">
					GitHub submissions for {courseId.toUpperCase()}
				</p>
			</div>

			<!-- Stats and Refresh -->
			<div class="flex flex-col gap-2 md:items-end">
				{#if repositories.length > 0}
					<div class="bg-muted border-foreground btn-drop-shadow rounded-xs border-2 p-3">
						<p class="font-archivo text-foreground mb-0 pb-0 text-xs font-bold uppercase">
							{repositories.length} repos • {issues.length} open issues
						</p>
					</div>
				{/if}

				<button
					on:click={fetchAllIssues}
					disabled={loading}
					class="bg-primary hover:bg-primary/80 border-foreground btn-drop-shadow text-primary-foreground flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm transition-colors disabled:opacity-50"
				>
					<RefreshCw class="h-4 w-4 {loading ? 'animate-spin' : ''}" />
					<span class="font-archivo text-sm font-bold">
						{loading ? 'Updating...' : 'Refresh Data'}
					</span>
				</button>
			</div>
		</div>
	</div>

	{#if error}
		<div class="mb-6 rounded-lg border-2 border-red-200 bg-red-50 p-4 text-red-800">
			<div class="flex items-center gap-2">
				<AlertCircle class="h-5 w-5" />
				<p class="font-archivo font-bold">Error loading data:</p>
			</div>
			<p class="font-archivo mt-1 text-sm">{error}</p>
		</div>
	{/if}

	{#if loading}
		<div class="bg-card border-foreground btn-drop-shadow rounded-lg border-2 p-12 text-center">
			<RefreshCw class="text-primary mx-auto mb-4 h-8 w-8 animate-spin" />
			<p class="text-foreground font-archivo text-lg font-bold">Loading GitHub issues...</p>
			<p class="text-muted-foreground font-archivo text-sm">This may take a moment</p>
		</div>
	{:else if issues.length === 0 && !loading}
		<div class="bg-card border-foreground btn-drop-shadow rounded-lg border-2 p-8 text-center">
			<Github class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
			<p class="text-foreground font-archivo mb-2 text-lg font-bold">No open issues found</p>
			<p class="text-muted-foreground font-archivo text-sm">
				{githubPrefix
					? `No open issues in repositories starting with "${githubPrefix}"`
					: 'Configure githubPrefix in meta.yaml to see issues'}
			</p>
		</div>
	{:else}
		<!-- Issues List -->
		<div class="space-y-4">
			{#each issues as issue, index}
				<div
					in:fly={{ y: 20, duration: 300, delay: index * 50 }}
					class="bg-card border-foreground btn-drop-shadow group overflow-hidden rounded-lg border-2 transition-all hover:shadow-lg"
				>
					<div class="p-6">
						<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
							<!-- Issue Info -->
							<div class="flex-1">
								<div class="mb-3 flex items-start gap-3">
									<img
										src={issue.user.avatar_url}
										alt="{issue.user.login}'s avatar"
										class="h-8 w-8 rounded-full"
									/>
									<div class="flex-1">
										<h3 class="font-roboto text-foreground mb-1 text-lg leading-tight font-bold">
											{issue.title}
										</h3>
										<div
											class="text-muted-foreground font-archivo flex flex-wrap items-center gap-4 text-sm"
										>
											<span class="flex items-center gap-1">
												<Github class="h-4 w-4" />
												{issue.repository.name}
											</span>
											<span>by @{issue.user.login}</span>
											<span>Created {formatDate(issue.created_at)}</span>
										</div>
									</div>
								</div>
							</div>

							<!-- Engagement Stats -->
							<div class="flex flex-col gap-2 md:flex-row md:items-center">
								<!-- Student Engagement -->
								<div class="bg-muted border-foreground rounded-lg border-2 p-3">
									<div class="flex items-center gap-2">
										<Users class="text-muted-foreground h-5 w-5" />
										<div class="inline-flex text-right">
											<p class="font-archivo text-foreground text-lg font-bold">
												{issue.unique_commenters}/{classStrength}
											</p>
											<p class="font-archivo text-muted-foreground text-xs">
												({getEngagementPercentage(issue.unique_commenters)}%)
											</p>
										</div>
									</div>
								</div>

								<!-- Action Button -->
								<a
									href={issue.html_url}
									target="_blank"
									rel="noopener noreferrer"
									class="bg-primary hover:bg-primary/80 border-foreground btn-drop-shadow text-primary-foreground flex items-center gap-2 rounded-xs border-2 px-4 py-2 text-sm transition-all hover:-translate-y-1 active:translate-y-0"
								>
									<ExternalLink class="h-4 w-4" />
									<span class="font-archivo text-sm font-bold">View Issue</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Footer Info -->
		{#if lastUpdated}
			<div class="bg-muted border-foreground mt-8 rounded-lg border-2 p-4 text-center">
				<p class="text-muted-foreground font-archivo text-sm">
					Last updated: {formatDate(lastUpdated.toISOString())}
				</p>
			</div>
		{/if}
	{/if}
</div>
