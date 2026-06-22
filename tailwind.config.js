/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        silver: '#141414',
        'silver-light': '#1e1e1e',
        'silver-border': '#2a2a2a',
        moss: '#2BEE34',
        'moss-dim': '#1fba28',
        'moss-faint': '#0d3d12',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
