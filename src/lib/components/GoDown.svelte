<script lang="ts">
	import { scrollTo } from 'svelte-scrolling';
	export let anchor: string;
</script>

<div class="mt-12">
	<a
		href="#{anchor}"
		use:scrollTo={anchor}
		class="pulse mx-auto flex h-8 w-8 items-center justify-center border border-amber-500/50 bg-black/40 text-amber-400 drop-shadow-glow transition-colors hover:border-amber-400 hover:text-amber-200"
	>
		<span class="pointer-events-none material-icons leading-none">arrow_downward</span>
	</a>
</div>

<style>
	@keyframes pulse-animation {
		0% {
			opacity: 0.7;
			transform: scale(1);
		}
		60%,
		100% {
			opacity: 0;
			transform: scale(1.7);
		}
	}
	.pulse {
		position: relative;
		z-index: 1;
	}
	.pulse::before {
		content: ' ';
		display: block;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		border: 1px solid var(--color-amber-500);
		box-shadow: 0 0 12px color-mix(in oklab, var(--color-amber-500) 50%, transparent);
		transition:
			opacity 0.3s,
			transform 0.3s;
		animation: pulse-animation 1.5s cubic-bezier(0.24, 0, 0.38, 1) infinite;
		z-index: -1;
	}
</style>
