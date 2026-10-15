/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#eaf0ff',
          500: '#3b82f6',
          700: '#1d4ed8',
          900: '#0f172a'
        }
      }
    }
  },
  plugins: []
};
