/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wed: {
          ivory: '#FFFDF8',
          gold: '#C5A46D',
          'gold-light': '#E8DCB8',
          'gold-dark': '#A37D44',
          cream: '#F8F4EC',
          'cream-dark': '#EFE7DA',
          brown: '#352D28',
          'brown-light': '#5E524A',
          'brown-muted': '#8A7B73',
          blush: '#EAD5D0',
          'blush-light': '#F7EBE8',
          'blush-dark': '#D4B5AD',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(53, 45, 40, 0.08), 0 4px 6px -2px rgba(53, 45, 40, 0.03)',
        'luxury-hover': '0 20px 35px -5px rgba(197, 164, 109, 0.2), 0 10px 10px -5px rgba(53, 45, 40, 0.04)',
      }
    },
  },
  plugins: [],
}

