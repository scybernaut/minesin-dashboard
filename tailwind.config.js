const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
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
        "non-nav": "calc(100vh - 3.5rem)",
      },
      height: {
        nav: "3.5rem",
        "non-nav": "calc(100vh - 3.5rem)",
      },
      colors: {
        primary: colors.blue["800"],
        "primary-light": colors.blue["600"],
        "on-primary": colors.white,
        accent: colors.yellow["500"],
        "on-accent": colors.white,
      },
      minWidth: {
        "2/5": "40%",
        fit: "fit-content",
      },
      maxWidth: {
        80: "20rem",
        96: "24rem",
        108: "27rem",
      },
    },
  },
  plugins: [],
};
