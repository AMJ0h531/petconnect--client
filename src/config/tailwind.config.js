// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // WHY content: Tailwind scans these files and removes unused CSS classes
  // This makes your final CSS bundle tiny — only what you actually use
  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {
      // Custom brand colors for Pet Connect Plus
      // WHY extend not replace: keeps all default Tailwind colors available
      colors: {
        brand: {
          teal:      '#1D9E75',  // primary — adoption/success
          tealLight: '#E1F5EE',
          warm:      '#D85A30',  // accent — energy/dogs
          warmLight: '#FAECE7',
          soft:      '#D4537E',  // secondary — cats/favorites
          softLight: '#FBEAF0',
        }
      },
      fontFamily: {
        // Playfair for headings — warm, trustworthy, memorable for a pet app
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        // Nunito for body — friendly, rounded, approachable
        body:    ['"Nunito"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    }
  },
  plugins: []
}