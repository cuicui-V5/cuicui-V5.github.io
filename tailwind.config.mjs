import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      typography: () => ({
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'inherit',
            a: {
              color: '#4f46e5',
              textDecoration: 'underline',
              textDecorationColor: '#c7d2fe',
              textDecorationThickness: '1.5px',
              textUnderlineOffset: '3px',
              fontWeight: '500',
              transition: 'color 0.15s, text-decoration-color 0.15s',
              '&:hover': {
                color: '#4338ca',
                textDecorationColor: '#4f46e5',
              },
            },
            blockquote: {
              borderLeftColor: '#818cf8',
              borderLeftWidth: '3px',
              backgroundColor: 'rgba(99, 102, 241, 0.04)',
              padding: '0.75rem 1.25rem',
              borderRadius: '0 0.5rem 0.5rem 0',
              fontStyle: 'normal',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              fontWeight: '500',
              color: '#4f46e5',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              padding: '0.2em 0.4em',
              borderRadius: '0.375rem',
              fontSize: '0.875em',
            },
            pre: {
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '0.75rem',
              padding: '1.25rem',
            },
            'h1, h2, h3, h4': {
              color: 'inherit',
              fontWeight: '600',
              letterSpacing: '-0.02em',
            },
          },
        },
        invert: {
          css: {
            a: {
              color: '#a5b4fc',
              textDecorationColor: '#4338ca',
              '&:hover': {
                color: '#c7d2fe',
                textDecorationColor: '#a5b4fc',
              },
            },
            blockquote: {
              borderLeftColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
            },
            code: {
              color: '#a5b4fc',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
