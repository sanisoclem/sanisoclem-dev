<script lang="ts">
	import { scrollRef } from 'svelte-scrolling';
	import Header from '$lib/components/Header.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import About from '$lib/components/About.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import ScrollSpy from '$lib/components/ScrollSpy.svelte';
	import bg from '$lib/assets/bg.png';
	import Footer from '$lib/components/Footer.svelte';
	import GridLight from '$lib/components/GridLight.svelte';
	import { gridField } from '$lib/gridSignals';
</script>

<svelte:head>
	<title>Jerahmeel Cosinas</title>
</svelte:head>

<div class="isolate bg-stone-950 text-stone-100">
	<GridLight />
	<div class="pointer-events-none fixed inset-0" use:gridField></div>
	<ScrollSpy>
		<Header />

		<section
			use:scrollRef={'intro'}
			class="scrollable-section main-section flex flex-col justify-center overflow-x-clip bg-black bg-cover bg-fixed bg-center text-center"
			id="intro"
			style="background-image:url('{bg}')"
		>
			<Intro />
		</section>

		<section
			use:scrollRef={'about'}
			id="about"
			class="scrollable-section main-section overflow-x-clip"
		>
			<About />
		</section>

		<section
			use:scrollRef={'contact'}
			id="contact"
			class="scrollable-section main-section overflow-x-clip"
		>
			<Contact />
		</section>
	</ScrollSpy>

	<footer
		use:scrollRef={'footer'}
		id="footer"
		class="border-t border-amber-500/10 bg-stone-900/50 py-8"
	>
		<Footer />
	</footer>
</div>

<style>
	@reference "../app.css";
	.main-section {
		@apply flex min-h-screen flex-col justify-center pt-16 pb-8;
	}

	#contact {
		min-height: calc(100vh - 124px);
	}

	#footer {
		min-height: 0;
	}
</style>
