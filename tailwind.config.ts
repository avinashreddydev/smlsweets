import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class', // Forces light mode unless class is added manually
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                serif: ["var(--font-playfair)", "serif"],
            },
            colors: {
                // International Style: Strict Monochrome
                primary: '#000000',
                secondary: '#ffffff',
                accent: '#d4af37', // Muted gold for very subtle highlights
                surface: '#f8f8f8',
                'surface-dark': '#0a0a0a',
            },
            fontSize: {
                'giant': ['12rem', { lineHeight: '1' }],
                'mega': ['8rem', { lineHeight: '1' }],
                'display': ['4rem', { lineHeight: '1.1' }],
            },
            letterSpacing: {
                'tighter': '-0.05em',
                'tight': '-0.02em',
                'widest': '0.2em',
            }
        },
    },
    plugins: [],
};
export default config;
