<script lang="ts">
	import { Button, type ButtonProps } from "$lib/components/ui/button/index.js";
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils/index.js";

	type Props = ButtonProps & {
		children: Snippet;
		/** Button variant with course-specific styling */
		variant?: "default" | "primary" | "secondary" | "accent" | "destructive" | "outline" | "ghost" | "link";
		/** Course-specific size variants */
		size?: "default" | "sm" | "lg" | "icon" | "course-lg";
	};

	let { 
		children, 
		class: className, 
		variant = "default",
		size = "default",
		...restProps 
	}: Props = $props();
</script>

<Button 
	{variant}
	{size}
	class={cn(
		// Course-specific enhancements
		variant === "primary" && [
			"bg-primary text-primary-foreground font-roboto font-bold uppercase tracking-normal",
			"border-2 border-foreground",
			"shadow-[var(--shadow-btn-drop)] transition-all duration-[var(--duration-250)]",
			"hover:shadow-[var(--shadow-btn-hover)] hover:-translate-y-1.5",
			"active:shadow-[var(--shadow-btn-active)] active:-translate-y-0.5 active:transition-none",
			"focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
		],
		size === "course-lg" && "px-6 py-3 text-xl",
		className
	)}
	{...restProps}
>
	{@render children()}
</Button>