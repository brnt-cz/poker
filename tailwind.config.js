/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f5ec',
          100: '#c5e6cf',
          200: '#9ed4b0',
          300: '#74c191',
          400: '#4aaf72',
          500: '#35654d',
          600: '#2a5340',
          700: '#1a472a',
          800: '#143a22',
          900: '#0e2d1a',
          950: '#071f11',
        },
        poker: {
          green: '#1a472a',
          felt: '#35654d',
          gold: '#d4af37',
          red: '#8b0000',
        }
      }
    },
  },
  plugins: [],
}
