<script lang="ts">
	import Resume from '$lib/components/Resume.svelte';
	import data from '$lib/data/cv.json';
</script>

<svelte:head>
	<title>Jerahmeel Cosinas - Resumé</title>
</svelte:head>

<Resume {data} />
