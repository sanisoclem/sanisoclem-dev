<script lang="ts">
	import { onMount } from 'svelte';
	import { activeSectionId } from './store';

  let container: HTMLElement;
	let sections: String[];
  let io: IntersectionObserver;
  let visible: String[] = [];

	onMount(() => {
		const sectionElements: Element[] = [].slice.call(container.querySelectorAll('.scrollable-section'));
		sections = sectionElements.map(s => s.id)

		io = new IntersectionObserver(entries => {
			entries.forEach(e => {
				const id = e.target.id
				if (e.isIntersecting) {
					if (visible.length > 0 && sections.indexOf(id) >=0 && sections.indexOf(id) < sections.indexOf(visible[0])){
            visible.unshift(id);
          }
          else {
            visible.push(id);
          }
				} else {
					const visiblePosition = visible.indexOf(id)
					visiblePosition > -1 && visible.splice(visiblePosition, 1)
				}
			})
      console.log(visible);
			activeSectionId.set(visible[0])
		}, { threshold: [ 0.05 ] });

		sectionElements.forEach(el => {
			io.observe(el)
		})

		return () => io.disconnect()
	})
</script>

<div class="scrollspy" bind:this={container}>
	<slot></slot>
</div>
