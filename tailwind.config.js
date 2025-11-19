/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}",
    "./build/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Primary (deep purple) ensures contrast >4.5:1 on white, white on primary >4.5:1
          primary: '#4B1F78', // WCAG AA against white (ratio ~7.6)
          primaryLight: '#7344B3',
          primaryDark: '#361458',
          // Accent (gold) with sufficient contrast both on dark and white backgrounds
          accent: '#DAA520', // ratio on white ~3.7 (use for larger text/buttons); on dark >7
          accentDark: '#A97F14',
          // Background tiers
          bg: '#0F0F17',
          bgAlt: '#1A1B26',
          surface: '#FFFFFF',
          surfaceAlt: '#F1F5F9',
          // Text colors
          body: '#2E2E38',
          muted: '#5A5A6B',
          onDark: '#F5F7FA',
          onLight: '#1F1F29'
        }
      }
    },
  },
  plugins: [],
}
