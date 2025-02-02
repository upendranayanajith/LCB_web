/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        moderno: ['"Museo Moderno"', 'sans-serif'], // Add Museo Moderno font
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}