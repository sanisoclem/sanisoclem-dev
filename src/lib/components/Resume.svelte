<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	export let data: JsonResume;
	let darkMode = true;

	interface JsonResume {
		basics: {
			name: string;
			label: string;
			image: string;
			email: string;
			phone: string;
			url: string;
			summary: string;
			location: {
				address: string;
				postalCode: string;
				city: string;
				countryCode: string;
				region: string;
			};
			profiles: {
				network: string;
				username: string;
				url: string;
			}[];
		};
		work: {
			name: string;
			country?: string;
			position: string;
			url?: string;
			startDate: string;
			endDate: string;
			summary: string;
			highlights: string[];
		}[];
		education: {
			institution: string;
			area: string;
			studyType: string;
			startDate: string;
			endDate: string;
			gpa: string;
			courses: string[];
		}[];
		skills: {
			name: string;
			level: string;
			keywords: string[];
		}[];
	}

	function toggleDarkMode() {
		darkMode = !darkMode;
	}
</script>

<div class:dark={darkMode}>
	<div
		class="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white print:text-gray-900 print:dark:text-gray-900 print:dark:bg-transparent"
	>
		<div class="max-w-screen-lg flex mx-auto p-10 gap-x-6 print:block print:py-0">
			<div class="w-9 flex-shrink-0 hidden md:flex flex-col gap-y-6 items-center print:hidden">
				<a href="/"
					><img
						src={data.basics.image}
						alt={data.basics.name}
						class="w-9 mx-auto utility-icon"
					/></a
				>
				<svg
					on:click={toggleDarkMode}
					class:dark={darkMode}
					class="cursor-pointer h-9 w-9 dark-toggle transition-all duration-200"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<mask id="mask">
						<rect x="0" y="0" width="100%" height="100%" fill="white" />
						<path
							class="sun-mask transition-all duration-200"
							d="M7,12a5,5 0 1,0 10,0a5,5 0 1,0 -10,0z"
						/>
					</mask>

					<path
						class="stroke-current sun transition-all duration-200"
						d="M7,12a5,5 0 1,0 10,0a5,5 0 1,0 -10,0z"
						mask="url(#mask)"
					/>

					<g class="sun-rays transition-all duration-200 stroke-current">
						<line x1="12" y1="1" x2="12" y2="3" />
						<line x1="12" y1="21" x2="12" y2="23" />
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
						<line x1="1" y1="12" x2="3" y2="12" />
						<line x1="21" y1="12" x2="23" y2="12" />
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
					</g>
				</svg>
				<a href="/cv.pdf" rel="external" title="or just print this page!">
					<svg class="h-9 w-9 utility-icon" viewBox="0 0 550.801 550.801">
						<path
							class="fill-current"
							d="M160.381,282.225c0-14.832-10.299-23.684-28.474-23.684c-7.414,0-12.437,0.715-15.071,1.432V307.6
		c3.114,0.707,6.942,0.949,12.192,0.949C148.419,308.549,160.381,298.74,160.381,282.225z"
						/>
						<path
							class="fill-current"
							d="M272.875,259.019c-8.145,0-13.397,0.717-16.519,1.435v105.523c3.116,0.729,8.142,0.729,12.69,0.729
		c33.017,0.231,54.554-17.946,54.554-56.474C323.842,276.719,304.215,259.019,272.875,259.019z"
						/>
						<path
							class="fill-current"
							d="M488.426,197.019H475.2v-63.816c0-0.398-0.063-0.799-0.116-1.202c-0.021-2.534-0.827-5.023-2.562-6.995L366.325,3.694
		c-0.032-0.031-0.063-0.042-0.085-0.076c-0.633-0.707-1.371-1.295-2.151-1.804c-0.231-0.155-0.464-0.285-0.706-0.419
		c-0.676-0.369-1.393-0.675-2.131-0.896c-0.2-0.056-0.38-0.138-0.58-0.19C359.87,0.119,359.037,0,358.193,0H97.2
		c-11.918,0-21.6,9.693-21.6,21.601v175.413H62.377c-17.049,0-30.873,13.818-30.873,30.873v160.545
		c0,17.043,13.824,30.87,30.873,30.87h13.224V529.2c0,11.907,9.682,21.601,21.6,21.601h356.4c11.907,0,21.6-9.693,21.6-21.601
		V419.302h13.226c17.044,0,30.871-13.827,30.871-30.87v-160.54C519.297,210.838,505.47,197.019,488.426,197.019z M97.2,21.605
		h250.193v110.513c0,5.967,4.841,10.8,10.8,10.8h95.407v54.108H97.2V21.605z M362.359,309.023c0,30.876-11.243,52.165-26.82,65.333
		c-16.971,14.117-42.82,20.814-74.396,20.814c-18.9,0-32.297-1.197-41.401-2.389V234.365c13.399-2.149,30.878-3.346,49.304-3.346
		c30.612,0,50.478,5.508,66.039,17.226C351.828,260.69,362.359,280.547,362.359,309.023z M80.7,393.499V234.365
		c11.241-1.904,27.042-3.346,49.296-3.346c22.491,0,38.527,4.308,49.291,12.928c10.292,8.131,17.215,21.534,17.215,37.328
		c0,15.799-5.25,29.198-14.829,38.285c-12.442,11.728-30.865,16.996-52.407,16.996c-4.778,0-9.1-0.243-12.435-0.723v57.67H80.7
		V393.499z M453.601,523.353H97.2V419.302h356.4V523.353z M484.898,262.127h-61.989v36.851h57.913v29.674h-57.913v64.848h-36.593
		V232.216h98.582V262.127z"
						/>
					</svg>
				</a>
			</div>
			<div class="flex-grow flex-wrap">
				<section class="space-y-2 mb-10">
					<div class="flex justify-between mb-4">
						<h1 class="text-2xl font-bold uppercase leading-10">{data.basics.name}</h1>
						<div>
							<img
								src={data.basics.image}
								alt={data.basics.name}
								class="w-9 h-9 utility-icon hidden print:block"
							/>
						</div>
					</div>
					<div class="font-semibold">{data.basics.label}</div>
					<ul class="summary-list flex gap-2 text-sm text-gray-500 font-light flex-col md:flex-row">
						<li>{data.basics.location.city}, {data.basics.location.region}</li>
						<li><a href="https://{data.basics.url}">{data.basics.url}</a></li>
						<li><a href="mailto:{data.basics.email}">{data.basics.email}</a></li>
						<li><a href="tel:{data.basics.phone}">{data.basics.phone}</a></li>
					</ul>
				</section>
				<section class="space-y-6 mb-10">
					<h2 class="uppercase text-xs text-gray-500 font-bold tracking-widest">Work Experience</h2>
					{#each data.work as work}
						<div class="space-y-2 no-break">
							<h3 class="text-md font-semibold uppercase">
								{#if work.url}
									<a href={work.url} class="text-base font-semibold hover:underline">{work.name}</a>
								{:else}
									<span>{work.name}</span>
								{/if}

								<span class="text-sm text-gray-500 ml-2 capitalize font-medium"
									>{work.country ? `(${work.country})` : ''}</span
								>
							</h3>
							<div class="text-gray-400 font-medium text-sm">
								<span>{work.position}</span> |
								<span class="">{work.startDate} - {work.endDate || 'Present'}</span>
							</div>
							<div class="markdown">
								<SvelteMarkdown source={work.summary} />
							</div>
						</div>
					{/each}
				</section>
				<section class="space-y-6 mb-10 no-break">
					<h2 class="uppercase text-xs text-gray-500 font-bold tracking-widest">Education</h2>
					{#each data.education as education}
						<div class="text-sm space-y-2">
							<SvelteMarkdown source={education.institution} />
						</div>
					{/each}
					<div class="no-break">
						<h2 class="uppercase text-xs text-gray-500 font-bold tracking-widest mb-4">
							Technologies
						</h2>
						<div class="flex flex-wrap gap-4">
							{#each data.skills as skill}
								<span
									class="bg-amber-400 dark:bg-amber-600 px-2 print:border-black print:border-solid print:border-1 print:dark:bg-amber-400"
									>{skill.name}</span
								>
							{/each}
						</div>
					</div>
				</section>
				<footer class="hidden print:block mt-10 w-full align-sub text-xs">
					<sub
						>see latest version @ <a href="https://jerahmeelcosinas.net/cv"
							>https://jerahmeelcosinas.net/cv</a
						></sub
					>
				</footer>
			</div>
		</div>
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
	.utility-icon:hover {
		animation: wobble 0.7s cubic-bezier(0.4, 0, 0.6, 1);
	}

	.summary-list > li:not(:first-child)::before {
		content: '|>';
		margin-right: 0.5rem;
	}

	a {
		@apply hover:text-amber-500;
	}

	.markdown {
		@apply text-sm;
	}

	.markdown :global(ul) {
		@apply list-disc pl-8;
	}

	.markdown :global(ul li) {
		@apply mt-2;
	}

	.no-break {
		break-inside: avoid;
	}

	.dark-toggle .sun {
		fill: transparent;
	}
	.dark-toggle .sun-mask {
		fill: white;
	}

	.dark-toggle.dark:not(:hover) .sun-rays,
	.dark-toggle:not(.dark):hover .sun-rays {
		stroke: transparent;
	}

	.dark-toggle.dark:not(:hover) .sun,
	.dark-toggle:not(.dark):hover .sun {
		fill: currentColor;
		d: path('M3,12a9,9 0 1,0 18,0a9,9 0 1,0 -18,0z');
	}

	.dark-toggle.dark:not(:hover) .sun-mask,
	.dark-toggle:not(.dark):hover .sun-mask {
		fill: black;
		d: path('M5,10a9,9 0 1,0 18,0a9,9 0 1,0 -18,0z');
	}
</style>
