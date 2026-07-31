/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        /** Природная палитра: кора, мох, тёплый песок, хвоя. */
        bark: '#0A0F0B',
        moss: '#A8C49B',
        sand: '#D9C7A3',
        fern: '#3E5F45',
      },
    },
  },
  plugins: [],
};
