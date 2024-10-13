/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      borderWidth: {
        1: '1px',
        2: '2px',
        3: '3px'
      },
      backgroundColor: {
        'vue-green': '#42b883'
      },
      borderColor: {
        'vue-green': '#42b883'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
