<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	type Props = HTMLAttributes<HTMLSpanElement> & {
		children: Snippet;
		/** Highlight color variant */
		variant?: "yellow" | "primary" | "secondary" | "accent" | "success" | "warning";
		/** Rotation angle for the highlight background */
		rotation?: number;
	};

	let { 
		children, 
		class: className, 
		variant = "yellow",
		rotation = -2,
		style,
		...restProps 
	}: Props = $props();

	const highlights = {
		yellow: "var(--course-yellow)",
		primary: "var(--color-primary)",
		secondary: "var(--color-secondary)", 
		accent: "var(--color-accent)",
		success: "var(--color-success-400)",
		warning: "var(--color-warning-400)"
	};
</script>

<span 
	class={cn(
		"relative z-[1] inline-block px-1",
		className
	)}
	style={`${style || ''}; --highlight-bg: ${highlights[variant]}; --highlight-rotation: ${rotation}deg;`}
	{...restProps}
>
	{@render children()}
</span>

<style>
	span::before {
		content: '';
		display: block;
		width: 100%;
		height: 40px;
		position: absolute;
		transform: translate(-50%, -50%) rotate(var(--highlight-rotation));
		top: 50%;
		left: 50%;
		z-index: -1;
		background-color: var(--highlight-bg);
		border-radius: 4px;
	}
</style>