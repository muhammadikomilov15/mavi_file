/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mavi: {
          primary: '#111111',
          bg: '#FFFFFF',
          secondary: '#F5F4F1',
          accent: '#B8A58A',
          'accent-hover': '#9F8D74',
          text: '#222222',
          muted: '#777777',
          border: '#E8E6E1',
          dark: '#0D0D0D'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Cinzel', 'serif']
      },
      letterSpacing: {
        widest: '.2em',
        luxury: '.15em'
      }
    },
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        mavitheme: {
          "primary": "#111111",
          "secondary": "#B8A58A",
          "accent": "#777777",
          "neutral": "#222222",
          "base-100": "#FFFFFF",
          "base-200": "#F5F4F1",
          "base-300": "#E8E6E1",
          "info": "#2563EB",
          "success": "#16A34A",
          "warning": "#D97706",
          "error": "#DC2626",
        },
      },
    ],
  },
}
