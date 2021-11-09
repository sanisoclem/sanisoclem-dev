<script lang="ts">
	import NavLink from '$lib/NavLink.svelte';
</script>

<header class="z-50 fixed w-screen shadow-lg bg-gray-900 text-white border-b-2 border-dashed border-gray-700">
	<div class="mx-auto px-8 py-2 container max-w-screen-xl">
		<div class="flex justify-between gap-x-2">
			<a href="#intro" id="intro-link" class="flex block gap-x-2 hover:text-yellow-500 transition-colors duration-75">
				<svg viewBox="0 0 10 10" class="logo h-10 w-10">
					<g>
						<path class="stroke-current transition-all duration-200" d="M4,1l4,0l0,4l0,4l-5,0l0,-3" />
					</g>
				</svg>
				<span class="uppercase leading-10 text-lg">Cosinas</span>
			</a>

			<nav class="">
				<ul class="hidden md:flex items-center gap-x-4">
					<NavLink href="#about" title="About" ></NavLink>
					<NavLink href="#projects" title="Projects"></NavLink>
					<NavLink href="#contact" title="Contact"></NavLink>
				</ul>
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
		d: path("m8,3l0,-2l-5,0l0,8l5,0l0,-2");
		stroke-dasharray: 10 1;
		stroke-dashoffset: -20;
		animation: dash 0.5s linear infinite;
	}
</style>