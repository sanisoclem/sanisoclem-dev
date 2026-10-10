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
	import { gridField, gridPhoto } from '$lib/gridSignals';
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
			class="scrollable-section main-section flex flex-col justify-center overflow-x-clip text-center"
			id="intro"
			style="--photo: url('{bg}')"
			use:gridPhoto={bg}
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
		class="relative border-t border-amber-500/10 bg-stone-900/50 py-8"
	>
		<Footer />
	</footer>
</div>

<style>
	@reference "../app.css";
	.main-section {
		@apply flex min-h-screen flex-col justify-center pt-16 pb-8;
	}

	#intro {
		--fade: var(--color-stone-950);
		background-color: var(--fade);
		background-image:
			repeating-linear-gradient(transparent 0 2px, rgb(0 0 0 / 0.3) 2px 3px),
			linear-gradient(transparent 50%, var(--fade)),
			radial-gradient(ellipse at 50% 45%, transparent 35%, var(--fade) 95%),
			linear-gradient(rgb(12 10 9 / 0.9), rgb(12 10 9 / 0.9)),
			linear-gradient(110deg in oklab, var(--color-cyan-500) 20%, var(--color-fuchsia-600) 80%),
			var(--photo);
		background-blend-mode: normal, normal, normal, normal, color, normal;
		background-attachment: fixed, scroll, scroll, scroll, fixed, fixed;
		background-size: auto, auto, auto, auto, auto, cover;
		background-position: center;
	}

	#contact {
		min-height: calc(100vh - 124px);
	}

	#footer {
		min-height: 0;
	}
</style>
