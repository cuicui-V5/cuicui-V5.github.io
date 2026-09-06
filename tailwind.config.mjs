import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#f4f4f5',
          100: '#e4e4e7',
          200: '#d4d4d8',
          300: '#a1a1aa',
          400: '#71717a',
          500: '#52525b',
          600: '#3f3f46',
          700: '#27272a',
          800: '#18181b',
          900: '#09090b',
        },
      },
      typography: () => ({
        DEFAULT: {
          css: {
            maxWidth: '68ch',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              textDecorationThickness: '1px',
              textUnderlineOffset: '3px',
              fontWeight: '500',
              '&:hover': {
                color: '#3b82f6',
              },
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              fontWeight: '500',
              backgroundColor: 'rgba(125, 125, 125, 0.1)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
            pre: {
              border: '1px solid rgba(125, 125, 125, 0.15)',
              borderRadius: '0.5rem',
              padding: '1rem',
            },
            'h1, h2, h3, h4': {
              color: 'inherit',
              fontWeight: '600',
              letterSpacing: '-0.02em',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
