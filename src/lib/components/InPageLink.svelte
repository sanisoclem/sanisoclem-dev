<script lang="ts">
	import { scrollTo } from 'svelte-scrolling';
	export let title: string;
	export let href: string;
	export let active = false;
</script>

<a
	class="leading-10 p-2 transition uppercase hover:text-amber-500 border-b-4 border-transparent {active
		? 'border-amber-500 text-amber-500'
		: ''}"
	href={`#${href}`}
	use:scrollTo={href}>{title}</a
>
