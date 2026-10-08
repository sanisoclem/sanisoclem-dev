<script lang="ts">
	let light: HTMLDivElement;
	let visible = false;
	let frame = 0;

	function follow(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			light.style.setProperty('--x', `${event.clientX}px`);
			light.style.setProperty('--y', `${event.clientY}px`);
			visible = true;
		});
	}

	function leave(event: MouseEvent) {
		if (!event.relatedTarget) visible = false;
	}
</script>

<svelte:window on:pointermove={follow} on:mouseout={leave} />

<div class="grid-light" class:visible bind:this={light} aria-hidden="true"></div>

<style>
	@property --x {
		syntax: '<length>';
		inherits: false;
		initial-value: -999px;
	}

	@property --y {
		syntax: '<length>';
		inherits: false;
		initial-value: -999px;
	}

	.grid-light {
		--line: color-mix(in oklab, var(--color-amber-500) 14%, transparent);
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		background-image:
			radial-gradient(
				circle 160px at var(--x) var(--y),
				color-mix(in oklab, var(--color-amber-500) 5%, transparent),
				transparent
			),
			linear-gradient(var(--line) 1px, transparent 1px),
			linear-gradient(90deg, var(--line) 1px, transparent 1px);
		background-size:
			100% 100%,
			32px 32px,
			32px 32px;
		mask-image: radial-gradient(circle 200px at var(--x) var(--y), black 20%, transparent);
		opacity: 0;
		transition:
			opacity 0.4s,
			--x 0.08s linear,
			--y 0.08s linear;
	}

	.grid-light.visible {
		opacity: 1;
	}
</style>
