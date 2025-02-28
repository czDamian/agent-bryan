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
    },
  },
  plugins: [],
};
