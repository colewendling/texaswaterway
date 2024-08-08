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
        primary: '#d0704a',
        secondary: '#E46C4E',
        background: '#fff8e6',
        water: '#D2DBED',
        gold: {
          DEFAULT: '#FFC000',
          light: '#FFFAE5',
        },
      },
      fontFamily: {
        inter: ['var(--inter)'],
      },
      keyframes: {
        boatSailing: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(var(--right-boundary))' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        boatSailing: 'boatSailing var(--boat-duration, 60s) infinite',
        slideInLeft: 'slideInLeft 1.5s ease-out forwards',
        slideInRight: 'slideInRight 1.5s ease-out 1.5s forwards',
        spin: 'spin 2s linear infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
};

export default config;
