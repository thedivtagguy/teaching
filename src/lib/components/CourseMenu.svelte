<script lang="ts">
	import { page } from '$app/stores';
	import { BookOpen, ChevronDown, ChevronUp, Clipboard } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Collapsible } from '$lib/components/ui/collapsible/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { cn } from '$lib/utils/index.js';
	import type {
		CourseMenu,
		MenuSection,
		Reading,
		Assignment,
		MenuItem
	} from '$lib/utils/contentSchema';

	export let courseId: string;
	export let menuData: CourseMenu | null = null;
	export let selectedCourse: string | null = null;

	// Current path for highlighting active item
	$: currentPath = $page.url.pathname;

	// Track expanded sections
	let expandedSections: Record<string, boolean> = {};

	// Compute flat list of all menu items across all sections
	$: flatMenuItems = menuData?.sections
		? menuData.sections
				.flatMap((section) =>
					section.items.map((item) => ({
						...item,
						sectionTitle: section.title
					}))
				)
				.sort((a, b) => {
					const orderA = a.order !== undefined ? a.order : 999;
					const orderB = b.order !== undefined ? b.order : 999;
					return orderA - orderB;
				})
		: [];

	// Initialize expanded state based on current path
	$: {
		if (menuData && menuData.collapsibleSections !== false) {
			menuData.sections.forEach((section: MenuSection) => {
				// Auto-expand the section that contains the active item
				const hasActiveItem = section.items.some((item) => item.path === currentPath);
				if (hasActiveItem && !expandedSections[section.title]) {
					expandedSections[section.title] = true;
				}
			});
		}
	}

	function toggleSection(sectionTitle: string) {
		expandedSections[sectionTitle] = !expandedSections[sectionTitle];
	}

	// Check if a section is an appendix section
	function isAppendixSection(sectionTitle: string): boolean {
		console.log(sectionTitle);
		return (
			sectionTitle === 'Appendix' ||
			sectionTitle.toLowerCase().includes('appendix') ||
			sectionTitle.toLowerCase().includes('notice')
		);
	}

	// Check if an item belongs to an appendix section
	function isAppendixItem(item: any): boolean {
		return item.sectionTitle && isAppendixSection(item.sectionTitle);
	}

	$: console.log(menuData);
</script>

{#snippet menuItemLink(item: any, isAppendix: boolean = false)}
	<a
		href={item.path}
		class={cn(
			'font-archivo -ml-px block border-l-2 py-1 pl-3 text-sm transition-colors',
			currentPath === item.path
				? isAppendix
					? 'border-primary text-primary font-bold'
					: 'border-primary font-bold'
				: isAppendix
					? 'text-foreground hover:text-primary hover:border-muted border-transparent'
					: 'text-foreground hover:text-primary hover:border-muted border-transparent'
		)}
	>
		{item.title}
	</a>
{/snippet}

{#snippet menuItemsList(items: any[], isAppendix: boolean = false)}
	<ul class="space-y-2">
		{#each items as item}
			<li>
				{@render menuItemLink(item, isAppendix)}
			</li>
		{/each}
	</ul>
{/snippet}

{#snippet sectionHeader(section: MenuSection, isAppendix: boolean = false)}
	{#if menuData?.collapsibleSections !== false}
		<!-- Collapsible Section Header -->
		<button
			class="group mb-3 flex w-full items-center justify-between text-left"
			on:click={() => toggleSection(section.title)}
			aria-expanded={expandedSections[section.title] || false}
		>
			<h4 class="font-libre-caslon text-foreground group-hover:text-primary flex items-center font-bold">
				{section.title}
			</h4>
			{#if expandedSections[section.title]}
				<ChevronUp class="text-foreground h-4 w-4" />
			{:else}
				<ChevronDown class="text-foreground h-4 w-4" />
			{/if}
		</button>

		{#if expandedSections[section.title]}
			{@render menuItemsList(section.items, isAppendix)}
		{/if}
	{:else}
		<!-- Non-Collapsible Section Header -->
		<h4 class="font-libre-caslon text-foreground mb-3 font-bold">
			{section.title}
		</h4>

		{@render menuItemsList(section.items, isAppendix)}
	{/if}
{/snippet}

{#snippet courseSection(section: MenuSection, isAppendix: boolean = false)}
	<li>
		<div class="course-section">
			{@render sectionHeader(section, isAppendix)}
		</div>
	</li>
{/snippet}

<div
	class="course-menu sticky top-8 max-h-[calc(100vh-8rem)] overflow-x-hidden overflow-y-auto pr-4"
>
	<header class="border-border mb-6 border-b pb-4">
		<a href="/{courseId}">
			<h3
				class="font-libre-caslon text-foreground hover:text-primary text-2xl font-semibold transition-colors"
			>
				{menuData?.title}
			</h3>
			<p class="text-muted-foreground font-archivo inline-block text-sm italic">
				{courseId.toUpperCase() || 'Course Content'}
			</p>
		</a>

		{#if selectedCourse}
			<div class="my-4 flex gap-2">
				<Button href="/{selectedCourse}/readings" size="lg">
					<BookOpen class="size-3" />
					<span>Readings</span>
				</Button>
				<Button href="/{selectedCourse}/assignments" size="lg">
					<Clipboard class="size-3" />
					<span>Assignments</span>
				</Button>
			</div>
		{/if}
	</header>

	{#if menuData}
		<nav aria-label="Course navigation">
			{#if menuData.showSections === false}
				<!-- Flat Menu (No Sections) -->
				{@render menuItemsList(flatMenuItems.filter((item) => !isAppendixItem(item)))}

				<!-- Show divider if there are appendix items -->
				{#if flatMenuItems.some((item) => isAppendixItem(item))}
					<div class="my-4">
						<Separator />
					</div>

					{@render menuItemsList(
						flatMenuItems.filter((item) => isAppendixItem(item)),
						true
					)}
				{/if}
			{:else}
				<!-- Main content sections -->
				<ul class="w-full space-y-4">
					{#each menuData.sections.filter((s) => !isAppendixSection(s.title)) as section}
						{@render courseSection(section, false)}
					{/each}
				</ul>

				<!-- Appendix sections with divider -->
				{#if menuData.sections.some((s) => isAppendixSection(s.title))}
					<div class="border-border my-4 border-t"></div>

					<ul class="w-full space-y-4">
						{#each menuData.sections.filter((s) => isAppendixSection(s.title)) as section}
							{@render courseSection(section, true)}
						{/each}
					</ul>
				{/if}
			{/if}
		</nav>
	{:else}
		<div class="bg-muted border-border rounded-lg border p-4">
			<p class="text-muted-foreground font-archivo">No menu data available</p>
		</div>
	{/if}
</div>

<style>
	/* Smooth height transition for expanded sections */
	:global(.course-section ul) {
		transition: height 0.25s ease-in-out;
	}
</style>
