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
        toast: {
          success: {
            bg: '#1e1314',
            font: '#ABF9DE',
            outline: 'rgba(19,189,129,0.4)',
            loader: '#15F0A5',
            close: '#4bbe95',
          },
          destructive: {
            bg: '#241616',
            font: '#FFDFDD',
            outline: 'rgba(241,74,60,0.4)',
            loader: '#F77A6F',
            close: '#C78A85',
          },
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
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        loader: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
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
        float: 'float 2s ease-in-out infinite',
        loader: 'loader 6s linear forwards',
        slideInLeft: 'slideInLeft 1.5s ease-out forwards',
        slideInRight: 'slideInRight 1.5s ease-out 1.5s forwards',
        spin: 'spin 2s linear infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
};

export default config;
