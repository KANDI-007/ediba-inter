/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#25C1FF', // cyan/sky from logo
          green: '#7AC142', // lime/green from logo
          dark: '#0F172A', // slate-900 for text contrast
        },
      },
      gradientColorStops: {
        'brand-start': '#25C1FF',
        'brand-end': '#7AC142',
      },
    },
  },
  plugins: [],
};
