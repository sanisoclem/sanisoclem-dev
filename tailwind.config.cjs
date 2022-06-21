const colors = require('tailwindcss/colors');

const config = {
	mode: 'jit',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			screens: {
				print: { raw: 'print' }
				// => @media print { ... }
			}
		}
	},

	plugins: []
};

module.exports = config;
