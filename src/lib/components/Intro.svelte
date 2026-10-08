<script lang="ts">
	import GoDown from './GoDown.svelte';
	import { gridSignals } from '../gridSignals';
</script>

<h1 class="sr-only">Jerahmeel Cosinas</h1>

<div class="graph-paper mx-auto mt-[60vh] w-fit px-24 py-16 sm:px-48 sm:py-20" use:gridSignals>
	<p
		class="description indent-[0.4em] font-mono tracking-[0.4em] text-amber-400 uppercase text-shadow-glow"
	>
		coding...
	</p>

	<div class="text-opacity-50 text-black">
		<GoDown anchor="about" />
	</div>
</div>
