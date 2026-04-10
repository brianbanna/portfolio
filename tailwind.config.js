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
			},
			fontFamily: {
				sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
				serif: ["var(--font-fraunces)", ...defaultTheme.fontFamily.serif],
				display: ["var(--font-fraunces)", ...defaultTheme.fontFamily.serif],
				mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
			},
			letterSpacing: {
				tightest: "-0.055em",
				tighter: "-0.035em",
			},
			fontSize: {
				"micro": ["10px", { lineHeight: "1.4", letterSpacing: "0.12em" }],
			},
			backgroundImage: {
				"gradient-radial":
					"radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-stops))",
				"grid-fg":
					"linear-gradient(to right, rgb(var(--color-fg) / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--color-fg) / 0.045) 1px, transparent 1px)",
				"dot-fg":
					"radial-gradient(rgb(var(--color-fg) / 0.12) 1px, transparent 1px)",
			},
			backgroundSize: {
				"grid-24": "24px 24px",
				"grid-64": "64px 64px",
				"dot-20": "20px 20px",
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
				"fade-up": "fade-up 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
				"rise": "rise 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
				"scan": "scan 6s ease-in-out infinite",
				"shimmer": "shimmer 3s linear infinite",
				"marquee": "marquee 40s linear infinite",
				"marquee-reverse": "marquee-reverse 40s linear infinite",
			},
			keyframes: {
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"fade-up": {
					"0%": { opacity: "0", transform: "translateY(18px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"rise": {
					"0%": { opacity: "0", transform: "translateY(40px)", filter: "blur(6px)" },
					"60%": { opacity: "1", filter: "blur(0)" },
					"100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
				},
				"scan": {
					"0%, 100%": { transform: "translateY(-100%)", opacity: "0" },
					"50%": { opacity: "0.5" },
				},
				"shimmer": {
					"0%": { backgroundPosition: "-200% 0" },
					"100%": { backgroundPosition: "200% 0" },
				},
				"marquee": {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(-50%)" },
				},
				"marquee-reverse": {
					"0%": { transform: "translateX(-50%)" },
					"100%": { transform: "translateX(0)" },
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("tailwindcss-debug-screens"),
	],
};
