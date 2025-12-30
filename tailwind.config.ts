import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f8f7f4",
          100: "#efece7",
          200: "#dad4c8",
          300: "#c2b7a5",
          400: "#a6947a",
          500: "#8c7761",
          600: "#715b4b",
          700: "#5b483c",
          800: "#3f322b",
          900: "#2b231f"
        },
        accent: {
          500: "#a86b4a",
          600: "#8d563a",
          700: "#6f422d"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(32, 23, 16, 0.12)",
        ring: "0 0 0 1px rgba(90, 70, 54, 0.18)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
