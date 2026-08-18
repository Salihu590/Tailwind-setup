/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Existing
        montserrat: ["Montserrat", "sans-serif"],
        "rubik-burned": ['"Rubik Burned"', "system-ui"],

        // NEW — MANWE fonts
        // Use as: font-display
        display: ["'Bebas Neue'", "sans-serif"],
        // Use as: font-mono
        mono: ["'Space Mono'", "monospace"],
      },

      colors: {
        manwe: {
          // Base
          black: "#080808",
          charcoal: "#151515",
          bone: "#E8E3D8",

          // Nigerian Green — muted, not bright
          green: "#1A5C2A",
          "green-light": "#2D7A3E",

          // Ivorian Orange — burnt, warm
          orange: "#C4541A",
          "orange-light": "#D4651F",
        },
      },
    },
  },
  plugins: [],
};