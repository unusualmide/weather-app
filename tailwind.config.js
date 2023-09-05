/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors : {
        searchlocation: '#1E213A',
        searchbutton: '#6E707A',
        searchtext1: '#E7E7EB',
        degree: '#A09FB1',
        today: '#88869D',
        displayweather: '#100E1D',
        textweather: '#110E3C',
        searchbutton2: '#3C47E9',
        searchplaceholder: '#616475',
      } 
    },
  },
  plugins: [],
}
