<script lang="ts">
	import InPageLink from './InPageLink.svelte';
	import { activeSectionId } from '../store';
	import { scrollTo } from 'svelte-scrolling';

	let introActive: boolean;
	let aboutActive: boolean;
	let projectsActive: boolean;
	let contactActive: boolean;

	activeSectionId.subscribe((id) => {
		introActive = id === 'intro';
		aboutActive = id === 'about';
		projectsActive = id === 'projects';
		contactActive = id === 'contact';
	});
</script>

<header
	class:bg-gray-900={aboutActive}
	class:bg-gray-800={contactActive}
	class:bg-emerald-800={projectsActive}
	class:bg-black={introActive}
	class="transition-color duration-200 z-50 fixed w-screen text-white"
>
	<div class="mx-auto px-8 container max-w-screen-xl">
		<div class="flex justify-between gap-x-2">
			<a
				href="#intro"
				use:scrollTo={'intro'}
				id="intro-link"
				class="flex gap-x-2 py-2 hover:text-amber-500 transition-colors duration-75"
			>
				<svg viewBox="0 0 10 10" class="logo h-10 w-10">
					<g>
						<path
							class="stroke-current transition-all duration-200"
							d="M4,1l4,0l0,4l0,4l-5,0l0,-3"
						/>
					</g>
				</svg>
				<span class="uppercase leading-10 text-lg">Cosinas</span>
			</a>

			<nav class="hidden md:flex items-center gap-x-4">
				<InPageLink href="about" title="About" active={aboutActive} />
				<InPageLink href="contact" title="Contact" active={contactActive} />
				<a
					class="leading-10 p-2 transition uppercase hover:text-amber-500 border-b-4 border-transparent flex gap-x-2 justify-center items-center"
					href="https://busstop.dev"
					>Blog <svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-4 h-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
						/>
					</svg>
				</a>
			</nav>
		</div>
	</div>
</header>

<style>
	@keyframes dash {
		to {
			stroke-dashoffset: 0;
		}
	}
	svg.logo {
		fill: none;
	}
	#intro-link:hover svg.logo path {
		d: path('m8,3l0,-2l-5,0l0,8l5,0l0,-2');
		stroke-dasharray: 10 1;
		stroke-dashoffset: -20;
		animation: dash 0.5s linear infinite;
	}
</style>
