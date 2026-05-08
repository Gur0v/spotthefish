import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fish: {
          primary: "var(--blue-primary)",
          dark: "var(--blue-dark)",
          light: "var(--blue-light)",
          success: "var(--success)",
          warning: "var(--warning)",
          danger: "var(--danger)",
          background: "var(--background)",
          card: "var(--card)",
          text: "var(--text-main)",
          muted: "var(--text-muted)",
          border: "var(--border)",
        },
      },
      fontFamily: {
        sans: ["Nunito", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(29, 155, 240, 0.12)",
        button: "0 5px 0 #0B75C9",
      },
    },
  },
  plugins: [],
};

export default config;
