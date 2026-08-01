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
        servicecycle: {
          primary: '#0284C7',
          'primary-content': '#FFFFFF',
          secondary: '#3D4F5C',
          'secondary-content': '#F8FAFC',
          accent: '#0EA5E9',
          'accent-content': '#082F49',
          neutral: '#1E293B',
          'base-100': '#DCE4EB',
          'base-200': '#CDD7E1',
          'base-300': '#B6C4D1',
          'base-content': '#15202A',
          info: '#0E7490',
          success: '#047857',
          warning: '#B45309',
          error: '#B91C1C',
          '--rounded-box': '0rem',
          '--rounded-btn': '0.25rem',
        },
      },
    ],
  },
} satisfies Config;
