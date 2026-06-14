/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        p:        'var(--p)',
        'p-deep': 'var(--p-deep)',
        'p-light':'var(--p-light)',
        'p-ultra':'var(--p-ultra)',
        'p-dark': 'var(--p-dark)',
        'p-mid':  'var(--p-mid)',
        'p-muted':'var(--p-muted)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans:  ['Jost', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: 'var(--p-border)',
      },
      letterSpacing: {
        widest: '4px',
        wide2:  '2px',
        wide15: '1.5px',
      },
    },
  },
  plugins: [],
};
