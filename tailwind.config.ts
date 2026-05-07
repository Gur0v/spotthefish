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
          primary: "#1D9BF0",
          dark: "#0B75C9",
          light: "#E8F5FF",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          background: "#F7FBFF",
          card: "#FFFFFF",
          text: "#172033",
          muted: "#64748B",
          border: "#D7E7F5",
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
