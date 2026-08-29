import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			zIndex: {
				'map-ui': '700',
				'map-search': '710',
				'map-dropdown': '720',
				'map-toast': '730',
			},
			colors: {
				obsidian: {
					950: '#06090e',
					900: '#0b111a',
					850: '#101926',
					800: '#172234',
					700: '#23334d',
				},
				radar: {
					amber: '#f59e0b',
					glow: 'rgba(245, 158, 11, 0.25)',
				},
				camera: {
					cyan: '#06b6d4',
					glow: 'rgba(6, 182, 212, 0.25)',
				},
			},
			boxShadow: {
				'glass-sm':
					'0 6px 20px -4px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.06)',
				'glass-md':
					'0 14px 32px -6px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.08)',
				'glass-lg':
					'0 24px 48px -8px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(15, 23, 42, 0.08)',
				'neon-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
				'neon-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
				'neon-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'dark-glass': 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(6, 9, 14, 0.95) 100%)',
			},
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
export default config;
