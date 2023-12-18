const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.tsx"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lime: colors.lime,
      },
    },
  },
  plugins: [],
};
