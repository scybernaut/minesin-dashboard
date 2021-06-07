const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: [
        "Inter var",
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        "Helvetica Neue",
        "Roboto",
        "sans-serif",
      ],
      minecraft: [
        "Minecrafter",
        "Inter var",
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        "Helvetica Neue",
        "Roboto",
        "sans-serif",
      ],
      mono: ["Fira Mono", "Roboto Mono", "monospace"],
    },
    extend: {
      minHeight: {
        12: "3rem",
        "non-nav": "calc(100vh - 3.5rem)",
      },
      height: {
        nav: "3.5rem",
        "non-nav": "calc(100vh - 3.5rem)",
      },
      colors: {
        primary: colors.blue["800"],
        "primary-dark": colors.blue["800"],
        "primary-light": colors.blue["600"],
        "on-primary": colors.white,
        accent: colors.orange["500"],
        "on-accent": colors.white,
      },
      backdropBrightness: {
        175: "1.75",
      },
      minWidth: {
        32: "8rem",
        72: "18rem",
      },
      maxWidth: {
        80: "20rem",
        96: "24rem",
        108: "27rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
