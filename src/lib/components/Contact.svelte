<script lang="ts">
	import bg from '$lib/assets/contact_bg.png';
	import { gridSignals } from '../gridSignals';
</script>

<div
	class="graph-paper container max-w-screen-md mx-auto flex justify-center flex-col md:flex-row items-center"
	use:gridSignals
>
	<img src={bg} alt="my cats" class="max-w-xs md:max-w-sm flex-grow-0" title="my cats say hello!" />

	<div class="flex flex-col justify-center flex-grow">
		<h2 class="font-display text-4xl font-bold mb-16 text-center text-shadow-glow">
			<span>Leave a message!</span>
		</h2>
		<ul class="flex justify-around w-full text-white">
			<li class="contact-link">
				<a href="mailto:mel@busstop.dev;" title="Email">
					<svg class="contact-icon fill-transparent" viewBox="2 0 20 20"
						><path
							d="m18.99 6.98l-6.99 5.666-6.991-5.666h13.981zm.01 10h-14v-8.505l7 5.673 7-5.672v8.504z"
						/></svg
					>
					<span class="link-label"> Email </span>
				</a>
			</li>
		</ul>
	</div>
</div>

<style>
	@reference "../../app.css";

	@keyframes wobble {
		30% {
			transform: scale(1.2);
		}
		40%,
		60% {
			transform: rotate(-20deg) scale(1.2);
		}
		50% {
			transform: rotate(20deg) scale(1.2);
		}
		70% {
			transform: rotate(0deg) scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes dash {
		to {
			stroke-dashoffset: 0;
		}
	}
	.fill-transparent {
		fill: transparent;
	}
	.contact-icon {
		@apply h-14 w-14 block mx-auto mb-2 transition-all duration-75 ease-in-out stroke-current;
		animation-fill-mode: both;
	}
	.contact-icon:hover {
		animation: wobble 0.7s cubic-bezier(0.4, 0, 0.6, 1);
	}
	.contact-link > a {
		@apply text-center block hover:text-amber-500 hover:drop-shadow-glow;
	}
	.link-label {
		display: none;
	}
</style>
