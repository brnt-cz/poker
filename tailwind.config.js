/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
