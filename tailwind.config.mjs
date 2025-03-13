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
        "light-pink-100": "#FCE8EC",
        "light-pink-200": "#FAD0DA",
        "light-pink-300": "#F6B8C8",
        "light-pink-400": "#F1A0B6",
        "light-pink-500": "#E989A5",
        "dark-pink-100": "#774F65",
        "dark-pink-200": "#693F58",
        "dark-pink-300": "#5C304B",
        "dark-pink-400": "#4E203E",
        "deep-wood-100": "#C19A6C",
        "deep-wood-200": "#BA8A65",
        "deep-wood-300": "#B37A5F",
        "deep-wood-400": "#AB6A58",
        "deep-wood-500": "#A45A51",
      },
      fontFamily: {
        coolvetica: "var(--font-coolvetica)",
        rubik: "var(--font-rubik)",
      },
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        toast:
          "slide-in-right 0.5s ease-out, fade-out 0.5s ease-in 2.5s forwards",
      },
    },
  },
  plugins: [],
};
