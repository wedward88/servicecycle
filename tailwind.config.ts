import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-body)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        bingequeue: {
          primary: '#A78BFA',
          'primary-content': '#1A0B2E',
          secondary: '#B6A8C9',
          'secondary-content': '#1A0B2E',
          accent: '#C084FC',
          'accent-content': '#1A0B2E',
          neutral: '#0C0614',
          'base-100': '#160E22',
          'base-200': '#1E1530',
          'base-300': '#2F2345',
          'base-content': '#F0E8FA',
          info: '#818CF8',
          success: '#34D399',
          warning: '#FBBF24',
          error: '#F87171',
          '--rounded-box': '0rem',
          '--rounded-btn': '0.25rem',
        },
      },
    ],
  },
} satisfies Config;
