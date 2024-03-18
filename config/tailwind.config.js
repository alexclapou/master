const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./public/*.html",
    "./app/helpers/**/*.rb",
    "./app/javascript/**/*.js",
    "./app/views/**/*.{erb,haml,html,slim}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica Neue",
          "Helvetica",
          "Roboto",
          "Arial",
          "sans-serif",
          ...defaultTheme.fontFamily.sans,
        ],
        source: ["Source\\ Serif\\ 4", "sans-serif"],
      },
      fontSize: {
        "4-5xl": "40px",
      },
      height: {
        19: "73px",
      },
      maxWidth: {
        pagemax: "1200px",
        contentmax: "680px",
      },
      spacing: {
        19: "64px",
        m184: "-184px",
        m200: "-164px",
      },
      width: {
        220: "220px",
      },
      padding: {
        "2-5": "10px",
        "4-5": "18px",
      },
      colors: {
        fade: "var(--color-text-fade)",
        behindfade: "var(--color-text-behind-fade)",
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
