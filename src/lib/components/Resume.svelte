<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';

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
			country: string;
			position: string;
			website: string;
			startDate: string;
			endDate: string;
			summary: string;
			highlights: string[];
		}[];
		volunteer: {
			organization: string;
			position: string;
			website: string;
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
		awards: {
			title: string;
			date: string;
			awarder: string;
			summary: string;
		}[];
		publications: {
			name: string;
			publisher: string;
			releaseDate: string;
			website: string;
			summary: string;
		}[];
		skills: {
			name: string;
			level: string;
			keywords: string[];
		}[];
		languages: {
			language: string;
			fluency: string;
		}[];
	}
	export let data: JsonResume;
</script>

<div class="bg-white text-gray-900">
	<div class="max-w-screen-lg flex mx-auto p-10 gap-x-6">
		<div class="w-9 flex-shrink-0 hidden md:block">
			<img src={data.basics.image} alt={data.basics.name} class="w-9 mx-auto" />
		</div>
		<div class="flex-grow flex-wrap">
			<section class="space-y-2 mb-10">
				<h1 class="text-2xl mb-4 font-bold uppercase leading-10">{data.basics.name}</h1>
				<div class="font-semibold">{data.basics.label}</div>
				<ul class="summary-list flex gap-x-2 text-sm text-gray-500 font-light">
					<li>{data.basics.location.city}, {data.basics.location.region}</li>
					<li><a href="https://{data.basics.url}">{data.basics.url}</a></li>
					<li><a href="mailto:{data.basics.email}">{data.basics.email}</a></li>
					<li><a href="tel:{data.basics.phone}">{data.basics.phone}</a></li>
				</ul>
				<p class="text-sm text-gray-500 italic pt-4">{data.basics.summary}</p>
			</section>
			<section class="space-y-6 mb-10">
				<h2 class="uppercase text-xs text-gray-500 font-bold tracking-widest">Work Experience</h2>
				{#each data.work as work}
					<div class="space-y-2">
						<h3 class="text-md font-semibold uppercase">
							{work.name}<span class="text-sm text-gray-500 ml-2 capitalize font-medium"
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
			<section class="space-y-6 mb-10">
				<h2 class="uppercase text-xs text-gray-500 font-bold tracking-widest">Education</h2>
				{#each data.education as education}
					<div class="text-sm space-y-2">
						<SvelteMarkdown source={education.institution} />
					</div>
				{/each}
				<div class="flex flex-wrap gap-x-4">
					{#each data.skills as skill}
						<span class="bg-yellow-400 px-2">{skill.name}</span>
					{/each}
				</div>
			</section>
		</div>
	</div>
</div>

<style>
	.summary-list > li:not(:first-child)::before {
		content: '|';
		margin-right: 0.5rem;
	}

	a {
		@apply hover:text-yellow-500;
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
</style>
