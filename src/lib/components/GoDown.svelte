<script lang="ts">
  import { scrollTo } from 'svelte-scrolling';
  export let anchor: string;
</script>

<div class="mt-20">
  <a href="#{anchor}" use:scrollTo={anchor} class="text-center block mx-auto h-10 w-10 text-white rounded-full bg-gray-900 bg-opacity-50 pulse">
    <span class="pointer-events-none material-icons leading-10">arrow_downward</span>
  </a>
</div>

<style>
  @keyframes pulse-animation{
		0%{
      background-color: black;
			opacity:1;
			transform:scale(1)
		}
		50%{
			opacity:0;
			transform:scale(1.5)
		}100%{
      background-color: white;
			opacity:0;
			transform:scale(1.5)
		}
	}
	.pulse {
		position:relative;
		z-index: 1;
	}
	.pulse::before {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: inherit;
    transition: opacity .3s, -webkit-transform .3s;
    transition: opacity .3s, transform .3s;
    transition: opacity .3s, transform .3s, -webkit-transform .3s;
    animation: pulse-animation 1.5s cubic-bezier(0.24, 0, 0.38, 1) infinite;
    z-index: -1;
	}
</style>