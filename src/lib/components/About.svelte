<script lang="ts">
	import GoDown from './GoDown.svelte';
</script>

<div class="mx-auto px-8 py-2 max-w-screen-md">
	<h2 class="text-4xl uppercase mb-16">About</h2>
	<p class="text-xl mb-8 text-justify">
		Hello, I'm Jerahmeel. I write code for a living and for fun. Nowadays, I code mostly in F# and
		Typescript for my day job.
	</p>
	<p class="text-lg mb-8 text-justify">
		When I have spare time, I also like to tinker with other technologies too. At the moment, I like <a
			class="underline hover:text-yellow-500"
			href="https://www.rust-lang.org/">rust</a
		>,
		<a class="underline hover:text-yellow-500" href="https://www.haskell.org/">haskell</a>, and most
		recently
		<a class="underline hover:text-yellow-500" href="https://rescript-lang.org/">rescript</a>. I'm
		also interested in graph databases (tried neo4j and xtdb - very interesting) but found rust
		support for them to be almost non-existent, so it's on hold for now 😥.
	</p>
	<p class="text-md text-justify">TL;DR: I like technology and I like to build stuff!</p>

	<div class="text-gray-900 text-opacity-50">
		<GoDown anchor="projects" />
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
