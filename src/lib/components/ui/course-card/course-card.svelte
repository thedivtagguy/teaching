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
		
		// Variant-specific styling
		variant === "lesson" && [
			"border-2 border-border bg-card/80 backdrop-blur-sm",
			"shadow-lg hover:shadow-xl transition-shadow duration-300"
		],
		
		variant === "assignment" && [
			"border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5",
			"shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary"
		],
		
		variant === "highlight" && [
			"border-2 border-accent bg-accent/10",
			"shadow-[var(--shadow-btn-drop)] relative",
			"before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-accent/5 before:to-transparent before:rounded-lg"
		],
		
		variant === "bordered" && [
			"border-2 border-muted-foreground/20 bg-card",
			"hover:border-muted-foreground/40 transition-colors duration-200"
		],
		
		// Add noise texture
		withNoise && "noise-image",
		
		className
	)}
	{...restProps}
>
	{@render children()}
</Card.Root>