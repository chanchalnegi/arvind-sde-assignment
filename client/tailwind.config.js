/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arvind: {
          50: '#f0f4fd',
          100: '#e1e9fa',
          500: '#2b58cd',
          600: '#1e40af',
          700: '#1d3587',
          800: '#192b6b',
          900: '#111847',
        }
      }
    },
  },
  plugins: [],
}
