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
        page: "var(--bg-page)",
        panel: "var(--bg-panel)",
        subtle: "var(--bg-subtle)",
        subtleHover: "var(--bg-hover)",
        borderSubtle: "var(--border-subtle)",
        borderStrong: "var(--border-strong)",
        title: "var(--text-title)",
        body: "var(--text-body)",
        muted: "var(--text-muted)",
        subtext: "var(--text-light)",
        alby: {
          green: "var(--alby-green)",
          greenBg: "var(--alby-green-bg)",
          greenBorder: "var(--alby-green-border)",
          terr: "var(--alby-terr)",
          terrBg: "var(--alby-terr-bg)",
          terrBorder: "var(--alby-terr-border)",
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
