/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "light-pink-50": "#FAF2F4",
        "light-pink-100": "#BD99A2", 
        "light-pink-200": "#D9D9D9",
        "dark-pink-100": "#774F65",
      },
      fontFamily: {
        coolvetica: "var(--font-coolvetica)",
        rubik: "var(--font-rubik)",
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        }
      },
      animation: {
        'toast': 'slide-in-right 0.5s ease-out, fade-out 0.5s ease-in 2.5s forwards'
      }
    },
  },
  plugins: [],
};