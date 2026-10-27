/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Cormorant Garamond', 'Georgia', 'serif'],
        journal: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fdfaf3',
          100: '#f9f3e7',
          200: '#f2e8d2',
          300: '#e9d8b4',
          400: '#dcc190',
          500: '#c9a866',
          600: '#a8894a',
          700: '#7d6238',
          800: '#524226',
          900: '#2e2415',
        },
        slate: {
          950: '#0f1217',
        },
        amber: {
          950: '#451a03',
        },
      },
      boxShadow: {
        archive: '0 10px 40px -12px rgba(60, 40, 15, 0.18)',
        page: '0 2px 12px -4px rgba(60, 40, 15, 0.15)',
        spine: 'inset 8px 0 12px -8px rgba(60, 40, 15, 0.25)',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.25)' },
          '50%': { transform: 'scaleY(1)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        softPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        wave: 'wave 1s ease-in-out infinite',
        fadeUp: 'fadeUp 0.5s ease-out both',
        fadeIn: 'fadeIn 0.4s ease-out both',
        softPulse: 'softPulse 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
