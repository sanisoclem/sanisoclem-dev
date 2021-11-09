<script lang="ts">
	export let title: string;
	export let href: string;
  export let active = false;
</script>

<li class="">
	<a
		class="leading-10 py-4 px-2 transition uppercase hover:text-yellow-500 border-b-4 border-transparent {active ? 'border-yellow-500 text-yellow-500' : ''}"
		{href}>{title}</a
	>
</li>
