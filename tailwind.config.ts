import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-pulse': 'fade-pulse 0.25s ease-in-out infinite',
      },
      keyframes: {
        'fade-pulse': {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
      },
      colors: {
        base: {
          '000': 'rgb(var(--base-000))',
          100: 'rgb(var(--base-100))',
          200: 'rgb(var(--base-200))',
          300: 'rgb(var(--base-300))',
          400: 'rgb(var(--base-400))',
          500: 'rgb(var(--base-500))',
          600: 'rgb(var(--base-600))',
          700: 'rgb(var(--base-700))',
          800: 'rgb(var(--base-800))',
          900: 'rgb(var(--base-900))',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
