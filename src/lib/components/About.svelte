<script lang="ts">
	import GoDown from './GoDown.svelte';
	import { gridSignals } from '../gridSignals';
</script>

<div class="graph-paper mx-auto max-w-screen-md px-8 py-2" use:gridSignals>
	<h2 class="mb-16 font-display text-4xl font-bold uppercase text-shadow-glow">About</h2>
	<p class="mb-8 text-justify text-xl text-stone-300">
		Hello, I'm Jerahmeel. I write code for a living and for fun. Nowadays, I code mostly in C# and
		Typescript for my day job.
	</p>
	<p class="mb-8 text-justify text-lg text-stone-300">
		On my free time, I like to tinker with other technologies. At the moment, I like <a
			class="underline hover:text-amber-500 hover:drop-shadow-glow"
			href="https://www.rust-lang.org/">rust</a
		>.
	</p>
	<p class="text-md text-justify text-stone-300">
		TL;DR: I like technology and I like to build stuff!
	</p>

	<div class="text-opacity-50 text-gray-900">
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
