<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: "focus-visible:border-ring no-underline border border-black rounded-md focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 font-archivo",
		variants: {
			variant: {
				default: 'bg-yellow text-neutral shadow-sm hover:shadow-md',

				orange:
					'bg-orange text-neutral shadow-sm border border-orange/20 hover:bg-orange/90 hover:shadow-md',

				blue: 'bg-blue text-white shadow-sm border border-black hover:bg-blue/90 hover:shadow-md',

				green:
					'bg-green text-neutral shadow-sm border border-green/20 hover:bg-green/90 hover:shadow-md',

				sage: 'bg-sage text-white shadow-sm border border-sage/20 hover:bg-sage/90 hover:shadow-md',

				purple:
					'bg-purple text-white shadow-sm border border-purple/20 hover:bg-purple/90 hover:shadow-md',

				outline:
					'bg-base-100 text-neutral shadow-sm border border-base-300 hover:bg-base-200 hover:border-neutral/30',

				secondary:
					'bg-base-200 text-neutral shadow-sm border border-base-300 hover:bg-base-300/80 hover:border-neutral/30',

				ghost: 'text-neutral hover:bg-base-200 hover:text-neutral',

				link: 'text-blue underline-offset-4 hover:underline hover:text-blue/80',

				destructive:
					'bg-red text-white shadow-sm border border-red/20 hover:bg-red/90 hover:shadow-md'
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5 text-xs',
				lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
				icon: 'size-9'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? 'link' : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
