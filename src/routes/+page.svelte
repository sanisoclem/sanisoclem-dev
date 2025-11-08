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
</script>

<svelte:head>
	<title>Jerahmeel Cosinas</title>
</svelte:head>

<div class="bg-gray-900 text-white">
	<ScrollSpy>
		<Header />

		<section
			use:scrollRef={'intro'}
			class="scrollable-section main-section flex flex-col justify-center bg-black bg-cover bg-fixed bg-center text-center"
			id="intro"
			style="background-image:url('{bg}')"
		>
			<Intro />
		</section>

		<section use:scrollRef={'about'} id="about" class="scrollable-section main-section">
			<About />
		</section>

		<section
			use:scrollRef={'contact'}
			id="contact"
			class="scrollable-section main-section bg-gray-800"
		>
			<Contact />
		</section>
	</ScrollSpy>

	<footer use:scrollRef={'footer'} id="footer" class="py-8">
		<Footer />
	</footer>
</div>

<style>
	@reference "../app.css";
	.main-section {
		@apply flex min-h-screen flex-col justify-center pt-14 pb-8;
	}

	#contact {
		min-height: calc(100vh - 124px);
	}

	#footer {
		min-height: 0;
	}
</style>
