/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgCol: "#030201",
        primaryS: {
          500: "#f79854",
          600: "#f57a23",
        },
        primary: {
          100: "#faba8d",
          200: "#d9a17a",
          300: "#ba8967",
          400: "#9b7255",
          500: "#7d5c44",
          600: "#614633",
          700: "#463223",
          800: "#2d1e14",
          900: "#150d07",
        },
        primaryL: {
          900: "#faba8d",
          800: "#fbc199",
          700: "#fcc8a4",
          600: "#fdcfb0",
          500: "#fdd6bb",
          400: "#feddc6",
          300: "#fee4d2",
          200: "#ffebdd",
          100: "#fff1e8",
          50: "#fff8f4",
        },
      },
    },
  },
  plugins: [require("tailwindcss-neumorphism")],
};
