import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './sanity/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/globals.css',
  ],
  theme: {
    extend: {
      screens: {
        '850': '850px',
      },
      colors: {
        white: '#f6f6f8',
        black: '#1b1d27',
        primary: {
          '100': '#f6e2db',
          '200': '#ecc6b7',
          '300': '#e3a992',
          '400': '#d98d6e',
          '500': '#d0704a',
          '600': '#a65a3b',
          '700': '#7d432c',
          '800': '#532d1e',
        },
        secondary: {
          '500': '#fff8e6',
        },
      },
      fontFamily: {
        inter: ['var(--inter)'],
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
};

export default config;
