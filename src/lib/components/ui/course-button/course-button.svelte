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
		// Course-specific enhancements - flat retro style
		variant === "primary" && [
			"btn-primary"
		],
		variant === "secondary" && [
			"font-roboto font-semibold tracking-wide",
			"bg-secondary text-secondary-foreground",
			"border-2 border-foreground",
			"shadow-[var(--shadow-btn-drop)] transition-all duration-200",
			"hover:shadow-[var(--shadow-btn-hover)] hover:-translate-y-1",
			"hover:bg-[color-mix(in_srgb,var(--color-secondary)_90%,black)]",
			"active:shadow-[var(--shadow-btn-active)] active:translate-y-0"
		],
		variant === "outline" && [
			"btn-outline"
		],
		variant === "ghost" && [
			"btn-ghost"
		],
		size === "course-lg" && "px-8 py-4 text-xl",
		className
	)}
	{...restProps}
>
	{@render children()}
</Button>