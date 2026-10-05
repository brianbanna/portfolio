const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./mdx-components.tsx",
		"content/**/*.mdx",
	],

	theme: {
		extend: {
			colors: {
				bg: "rgb(var(--color-bg) / <alpha-value>)",
				fg: "rgb(var(--color-fg) / <alpha-value>)",
				accent: "rgb(var(--color-accent) / <alpha-value>)",
				paper: "rgb(var(--color-paper) / <alpha-value>)",
				ink: "rgb(var(--color-ink) / <alpha-value>)",
				muted: "rgb(var(--color-muted) / <alpha-value>)",
				hairline: "rgb(var(--color-hairline) / <alpha-value>)",
				section: "rgb(var(--section-accent) / <alpha-value>)",
			},
			fontFamily: {
				sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
				serif: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
			},
			letterSpacing: {
				tightest: "-0.055em",
				tighter: "-0.035em",
			},
			typography: {
				DEFAULT: {
					css: {
						"code::before": { content: '""' },
						"code::after": { content: '""' },
					},
				},
				quoteless: {
					css: {
						"blockquote p:first-of-type::before": { content: "none" },
						"blockquote p:first-of-type::after": { content: "none" },
					},
				},
			},
			animation: {
				"fade-in": "fade-in 1.2s ease-out forwards",
				"fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
				"rise": "rise 1.15s cubic-bezier(0.22, 1, 0.36, 1) forwards",
			},
			keyframes: {
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"fade-up": {
					"0%": { opacity: "0", transform: "translateY(8px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"rise": {
					// Opacity and travel finish together. A mid keyframe made the
					// name flash in while it was still sliding.
					"0%": { opacity: "0", transform: "translateY(16px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
