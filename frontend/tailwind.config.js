/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        navbar: '#FFFFFF',
        primary: '#A8E6CF',
        primaryHover: '#D9F8C4',
        secondary: '#B3E5FC',
        cta: '#FFCCBC',
        cardShadow: 'rgba(0,0,0,0.05)',
        textPrimary: '#333333',
        textSecondary: '#666666',
      },
      boxShadow: {
        subtle: '0 4px 12px 0 rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};
