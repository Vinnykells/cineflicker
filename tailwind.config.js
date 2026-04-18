/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        flicker: {
          red: '#e50914',
          darkred: '#b20710',
          black: '#0a0a0a',
          dark: '#111111',
          card: '#161616',
          border: '#222222',
          gray: '#86868b',
          white: '#f5f5f7',
        },
      },
    },
  },
  plugins: [],
}
