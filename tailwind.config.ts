import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f0e0c",
        dark: "#1a1815",
        card: "#181512",
        cardBorder: "#2e2820",
        cardHover: "#241f19",
        alby: {
          green: "#7a9a5c",
          forest: "#4a6f4a",
          terr: "#c97755",
          terrdark: "#a0654a",
          olive: "#828c5a",
          light: "#f8f6f0",
          cream: "#e8e2d2",
          pale: "#c5bfb1",
          muted: "#9a9489"
        }
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      }
    },
  },
  plugins: [],
};
export default config;
