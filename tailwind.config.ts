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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        base: {
          '000': 'var(--base-000)',
          100: 'var(--base-100)',
          200: 'var(--base-200)',
          300: 'var(--base-300)',
          400: 'var(--base-400)',
          500: 'var(--base-500)',
          600: 'var(--base-600)',
          700: 'var(--base-700)',
          800: 'var(--base-800)',
          900: 'var(--base-900)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
