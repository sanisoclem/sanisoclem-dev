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
				<a href="mailto:contact@jerahmeelcosinas.net;" title="Email">
					<svg class="contact-icon fill-transparent" viewBox="2 0 20 20"
						><path
							d="m18.99 6.98l-6.99 5.666-6.991-5.666h13.981zm.01 10h-14v-8.505l7 5.673 7-5.672v8.504z"
						/></svg
					>
					<span class="link-label"> Email </span>
				</a>
			</li>
			<li class="contact-link">
				<a href="https://t.me/sanisoclem" title="Telegram">
					<svg class="contact-icon fill-transparent" viewBox="2 0 28 28">
						<path
							d="m7.06510669 16.9258959c5.22739451-2.1065178 8.71314291-3.4952633 10.45724521-4.1662364 4.9797665-1.9157646 6.0145193-2.2485535 6.6889567-2.2595423.1483363-.0024169.480005.0315855.6948461.192827.1814076.1361492.23132.3200675.2552048.4491519.0238847.1290844.0536269.4231419.0299841.65291-.2698553 2.6225356-1.4375148 8.986738-2.0315537 11.9240228-.2513602 1.2428753-.7499132 1.5088847-1.2290685 1.5496672-1.0413153.0886298-1.8284257-.4857912-2.8369905-1.0972863-1.5782048-.9568691-2.5327083-1.3984317-4.0646293-2.3321592-1.7703998-1.0790837-.212559-1.583655.7963867-2.5529189.2640459-.2536609 4.7753906-4.3097041 4.755976-4.431706-.0070494-.0442984-.1409018-.481649-.2457499-.5678447-.104848-.0861957-.2595946-.0567202-.3712641-.033278-.1582881.0332286-2.6794907 1.5745492-7.5636077 4.6239616-.715635.4545193-1.3638349.6759763-1.9445998.6643712-.64024672-.0127938-1.87182452-.334829-2.78737602-.6100966-1.12296117-.3376271-1.53748501-.4966332-1.45976769-1.0700283.04048-.2986597.32581586-.610598.8560076-.935815z"
						/>
					</svg>
					<span class="link-label"> Telegram </span>
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
		@apply text-center block hover:text-yellow-500;
	}
	.link-label {
		display: none;
	}
</style>
