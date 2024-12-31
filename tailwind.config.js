/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#60A5FA', // The blue color from your wireframes
        secondary: '#E5E7EB',
      },
      fontFamily: {
        'comic': ['"Comic Neue"', 'cursive'],
      },
    },
  },
  plugins: [],
}