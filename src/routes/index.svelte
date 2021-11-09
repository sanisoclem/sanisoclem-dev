<script context="module" lang="ts">
	 import { scrollRef } from 'svelte-scrolling'
	import Header from '$lib/Header.svelte';
	import Intro from '$lib/Intro.svelte';
	import About from '$lib/About.svelte';
	import Projects from '$lib/Projects.svelte';
	import Contact from '$lib/Contact.svelte';
	import ScrollSpy from '$lib/ScrollSpy.svelte';
	export const prerender = true;
</script>

<script lang="ts">
	import bg from './bg.png';
</script>

<svelte:head>
	<title>Jerahmeel Cosinas</title>
</svelte:head>

<ScrollSpy>
	<Header />

	<section
		use:scrollRef={'intro'}
		class="scrollable-section main-section bg-fixed bg-cover text-center bg-black bg-center flex flex-col justify-center"
		id="intro"
		style="background-image:url('{bg}')"
	>
		<Intro />
	</section>

	<section use:scrollRef={'about'} id="about" class="scrollable-section main-section">
		<About />
	</section>

	<section use:scrollRef={'projects'} id="projects" class="scrollable-section main-section bg-green-800">
		<Projects />
	</section>

	<section use:scrollRef={'contact'} id="contact" class="scrollable-section main-section">
		<Contact />
	</section>
</ScrollSpy>

<style>
	.main-section {
		@apply pb-8 pt-14 min-h-screen flex flex-col justify-center;
	}
</style>
