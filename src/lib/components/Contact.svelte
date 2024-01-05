<script lang="ts">
	import bg from '$lib/assets/contact_bg.png';
</script>

<div
	class="container max-w-screen-md mx-auto flex justify-center flex-col md:flex-row items-center"
>
	<img src={bg} alt="my cats" class="max-w-xs md:max-w-sm flex-grow-0" title="my cats say hello!" />

	<div class="flex flex-col justify-center flex-grow">
		<h2 class="text-4xl mb-16 text-center">
			<span>Leave a message!</span>
		</h2>
		<ul class="flex justify-around w-full text-white">
			<li class="contact-link">
				<a href="https://www.linkedin.com/in/jerahmeel-cosinas/" title="LinkedIn">
					<svg class="contact-icon fill-transparent" viewBox="0 0 64 64"
						><path
							stroke-linecap="round"
							stroke-miterlimit="10"
							stroke-width="2"
							d="M3.078 22.331h12.188v36.844H3.078z"
						/><path
							d="M46.719 21.112c-5.344 0-8.531 1.969-11.906 6.281v-5.062H22.625v36.844h12.281V39.206c0-4.219 2.156-8.344 7.031-8.344s7.781 4.125 7.781 8.25v20.063H62V38.269c0-14.532-9.844-17.157-15.281-17.157z"
							stroke-linecap="round"
							stroke-miterlimit="10"
							stroke-width="2"
						/><path
							d="M9.219 4.425C5.188 4.425 2 7.331 2 10.894s3.188 6.469 7.219 6.469 7.219-2.906 7.219-6.469-3.188-6.469-7.219-6.469z"
							stroke-linecap="round"
							stroke-miterlimit="10"
							stroke-width="2"
						/></svg
					>
					<span class="link-label"> LinkedIn </span>
				</a>
			</li>
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
			<li class="contact-link">
				<a href="https://twitter.com/busstop7448" title="Twitter">
					<svg viewBox="0 0 20 20" aria-hidden="true" class="contact-icon fill-transparent" 
						><path
							d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 20 3.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 .8 7.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.095 4.095 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 0 16.407a11.615 11.615 0 0 0 6.29 1.84"
						/></svg
					>
					<span class="link-label"> Twitter </span>
				</a>
			</li>
		</ul>
	</div>
</div>

<style lang="postcss">
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
		@apply text-center block hover:text-amber-500;
	}
	.link-label {
		display: none;
	}
</style>
