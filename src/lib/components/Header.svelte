<script lang="ts">
	import InPageLink from './InPageLink.svelte';
	import { activeSectionId } from '../store';
	import { scrollTo } from 'svelte-scrolling';

	const headerColorClasses = {
		about: 'bg-gray-900',
		projects: 'bg-green-500',
		contact: 'bg-gray-900'
	};

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
	class:bg-green-800={projectsActive}
	class:bg-black={introActive}
	class="transition-color duration-200 z-50 fixed w-screen text-white"
>
	<div class="mx-auto px-8 container max-w-screen-xl">
		<div class="flex justify-between gap-x-2">
			<a
				href="#intro"
				use:scrollTo={'intro'}
				id="intro-link"
				class="flex block gap-x-2 py-2 hover:text-yellow-500 transition-colors duration-75"
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
				<InPageLink href="projects" title="Projects" active={projectsActive} />
				<InPageLink href="contact" title="Contact" active={contactActive} />

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
