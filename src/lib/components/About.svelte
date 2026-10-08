<script lang="ts">
	import GoDown from './GoDown.svelte';
	import { gridSignals } from '../gridSignals';
</script>

<div class="graph-paper mx-auto px-8 py-2 max-w-screen-md" use:gridSignals>
	<h2 class="font-display text-4xl font-bold uppercase mb-16 text-shadow-glow">About</h2>
	<p class="text-xl mb-8 text-justify">
		Hello, I'm Jerahmeel. I write code for a living and for fun. Nowadays, I code mostly in F#, C#
		and Typescript for my day job.
	</p>
	<p class="text-lg mb-8 text-justify">
		On my free time, I like to tinker with other technologies. At the moment, I like <a
			class="underline hover:text-amber-500 hover:drop-shadow-glow"
			href="https://www.rust-lang.org/">rust</a
		>
		and
		<a
			class="underline hover:text-amber-500 hover:drop-shadow-glow"
			href="https://www.purescript.org/">purescript</a
		>.
	</p>
	<p class="text-md text-justify">TL;DR: I like technology and I like to build stuff!</p>

	<div class="text-gray-900 text-opacity-50">
		<GoDown anchor="contact" />
	</div>
</div>

<style>
	@keyframes point-down {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(5px);
		}
	}
</style>
