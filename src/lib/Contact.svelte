<script lang="ts">
	import bg from './contact_bg.png';
</script>

<div class="flex justify-center">
	<img src={bg} alt="my cats" title="my cats say hello!" />

	<div class="flex flex-col justify-center">
		<h2 class="text-4xl mb-16">
			<span>Leave a message!</span>
		</h2>
		<ul class="flex justify-around w-full text-white">
			<li class="contact-link">
				<a href="https://www.linkedin.com/in/jerahmeel-cosinas/" title="LinkedIn">
          <svg viewBox="0 0 24 24" class="contact-icon"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/></svg>
					<span class="link-label"> LinkedIn </span>
				</a>
			</li>
			<li class="contact-link">
				<a href="https://github.com/sanisoclem" title="GitHub">
          <svg class="contact-icon" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
					<span class="link-label"> GitHub </span>
				</a>
			</li>
			<li class="contact-link">
				<a href="mailto:contact@jerahmeelcosinas.net;" title="Email">
          <svg class="contact-icon" viewBox="0 0 24 24"><path d="M12 .02c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.99 6.98l-6.99 5.666-6.991-5.666h13.981zm.01 10h-14v-8.505l7 5.673 7-5.672v8.504z"/></svg>
					<span class="link-label"> Email </span>
				</a>
			</li>
		</ul>
	</div>
</div>

<style>
  .contact-icon {
    @apply h-10 w-10 block mx-auto mb-2 transition-all duration-75 ease-in-out fill-current;
  }
  .contact-link > a {
    @apply text-center block hover:text-yellow-200;
  }
  .link-label {
    @apply transition-all duration-75;
    opacity: 0;
    visibility: hidden;
  }
  .contact-link > a:hover .link-label {
    opacity: 1;
    visibility: visible;
  }
</style>