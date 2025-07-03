<script lang="ts">
	import { Card } from "$lib/components/ui/card/index.js";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		/** Course-specific card variants */
		variant?: "default" | "lesson" | "assignment" | "highlight" | "bordered";
		/** Add noise texture overlay */
		withNoise?: boolean;
	};

	let { 
		children, 
		class: className, 
		variant = "default",
		withNoise = false,
		...restProps 
	}: Props = $props();
</script>

<Card.Root 
	class={cn(
		// Base course card styling
		"relative",
		
		// Variant-specific styling - flat retro style
		variant === "lesson" && [
			"card-flat",
			"bg-card"
		],
		
		variant === "assignment" && [
			"border-2 border-primary bg-primary/5",
			"shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]",
			"transition-all duration-200"
		],
		
		variant === "highlight" && [
			"card-elevated",
			"bg-accent/10 border-accent"
		],
		
		variant === "bordered" && [
			"border-2 border-muted bg-card",
			"hover:border-foreground/40 transition-colors duration-200"
		],
		
		variant === "default" && [
			"card-flat"
		],
		
		// Add noise texture
		withNoise && "noise-image",
		
		className
	)}
	{...restProps}
>
	{@render children()}
</Card.Root>