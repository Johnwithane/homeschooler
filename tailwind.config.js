/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'comic': ['"Comic Sans MS"', 'cursive', 'sans-serif'],
        'hand': ['"Patrick Hand"', '"Comic Sans MS"', 'cursive', 'sans-serif'],
      },
      colors: {
        'paper': '#FFFEF7',
        'ink': '#1a1a1a',
      },
    },
  },
  plugins: [],
}
