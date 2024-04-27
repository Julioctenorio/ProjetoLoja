/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily:{
      'sans': ['Poppins', 'sans-serif']
    },
    extend: {
      backgroundImage:{
        "home": "url('/assets/bg1.jpeg')"
      }
    },
    brightness: {
      50: '.5',
      175: '1.75',
    }
  },
  plugins: [],
}

