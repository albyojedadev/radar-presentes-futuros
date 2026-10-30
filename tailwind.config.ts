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
        background: "var(--background)",
        foreground: "var(--foreground)",
        radar: {
          dark: "#090d16",
          card: "#0f1624",
          border: "#1e293b",
          accent: "#38bdf8",
          pro: "#10b981",
          contra: "#f43f5e",
          amber: "#f59e0b",
        }
      },
    },
  },
  plugins: [],
};
export default config;
