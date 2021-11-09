<script lang="ts">
	import bg from './contact_bg.png';
</script>

<div class="container max-w-screen-md mx-auto flex justify-center flex-col md:flex-row items-center">
	<img src={bg} alt="my cats" class="max-w-xs md:max-w-sm flex-grow-0" title="my cats say hello!" />

	<div class="flex flex-col justify-center flex-grow">
		<h2 class="text-4xl mb-16 text-center">
			<span>Leave a message!</span>
		</h2>
		<ul class="flex justify-around w-full text-white">
			<li class="contact-link">
				<a href="https://www.linkedin.com/in/jerahmeel-cosinas/" title="LinkedIn">
          <svg class="contact-icon contact-icon-64" viewBox="0 0 64 64"><path stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M3.078 22.331h12.188v36.844H3.078z"></path><path d="M46.719 21.112c-5.344 0-8.531 1.969-11.906 6.281v-5.062H22.625v36.844h12.281V39.206c0-4.219 2.156-8.344 7.031-8.344s7.781 4.125 7.781 8.25v20.063H62V38.269c0-14.532-9.844-17.157-15.281-17.157z" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"></path><path d="M9.219 4.425C5.188 4.425 2 7.331 2 10.894s3.188 6.469 7.219 6.469 7.219-2.906 7.219-6.469-3.188-6.469-7.219-6.469z" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"></path></svg>
					<span class="link-label"> LinkedIn </span>
				</a>
			</li>
			<li class="contact-link">
				<a href="https://github.com/sanisoclem" title="GitHub">
          <svg class="contact-icon" viewBox="0 0 24 24" version="1.1" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
					<span class="link-label"> GitHub </span>
				</a>
			</li>
			<li class="contact-link">
				<a href="mailto:contact@jerahmeelcosinas.net;" title="Email">
          <svg class="contact-icon" viewBox="2 0 20 20"><path d="m18.99 6.98l-6.99 5.666-6.991-5.666h13.981zm.01 10h-14v-8.505l7 5.673 7-5.672v8.504z"/></svg>
					<span class="link-label"> Email </span>
				</a>
			</li>
		</ul>
	</div>
</div>

<style>
	@keyframes wobble {
		30% { transform: scale(1.2); }
		40%, 60% { transform: rotate(-20deg) scale(1.2); }
		50% { transform: rotate(20deg) scale(1.2); }
		70% { transform: rotate(0deg) scale(1.2); }
		100% { transform: scale(1); }
	}
	@keyframes dash {
		to {
			stroke-dashoffset: 0;
		}
	}
  .contact-icon {
    @apply h-14 w-14 block mx-auto mb-2 transition-all duration-75 ease-in-out stroke-current;
		animation-fill-mode: both;
		fill: transparent;
  }
	.contact-icon:hover {
		stroke-dasharray: 10 1;
		stroke-dashoffset: -20;
		animation: wobble 0.7s cubic-bezier(0.4, 0, 0.6, 1), dash 0.5s linear infinite;
	}
	.contact-icon-64:hover {
		stroke-dasharray: 30 3;
	}
  .contact-link > a {
    @apply text-center block hover:text-yellow-200;
  }
  .link-label {
    display: none;
  }
</style>