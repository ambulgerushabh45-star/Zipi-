/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f5f6f8',
          100: '#e8eaee',
          200: '#d0d4dc',
          300: '#a9b0bc',
          400: '#7b8492',
          500: '#5a6270',
          600: '#434a57',
          700: '#2f3540',
          800: '#1d222b',
          900: '#0f1217',
        },
        brand: {
          50: '#eef5ff',
          100: '#d9e8ff',
          200: '#b5d3ff',
          300: '#82b6ff',
          400: '#4c92ff',
          500: '#1f72ff',
          600: '#0a5cff',
          700: '#0a4ad6',
          800: '#0c3da9',
          900: '#0d3486',
        },
        accent: {
          50: '#ecfbff',
          100: '#cff4ff',
          200: '#a2e9ff',
          300: '#5fdaff',
          400: '#22c5f0',
          500: '#00a6d6',
        },
        success: { 500: '#15a06a', 600: '#0f7f54' },
        warning: { 500: '#e6a100', 600: '#b97f00' },
        danger: { 500: '#e5484d', 600: '#c93438' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(15, 18, 23, 0.08)',
        lift: '0 24px 48px -16px rgba(15, 18, 23, 0.22)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.9' },
          '50%': { transform: 'translateY(8px)', opacity: '0.4' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        bob: 'bob 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
