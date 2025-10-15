/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm neutral palette as per PRD
        primary: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#e8e4dd',
          300: '#d9d2c7',
          400: '#c7beb0',
          500: '#b5a896',
          600: '#a3947f',
          700: '#8a7a68',
          800: '#726456',
          900: '#5d5147',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
