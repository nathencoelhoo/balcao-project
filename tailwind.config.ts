import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        laterite: { DEFAULT: "#A33226", dark: "#8B261E" },
        villa: { DEFAULT: "#E5A93C", light: "#F1C453" },
        ink: "#1E1E1E",
        linen: { DEFAULT: "#F9F6F0", dark: "#F1EADC" },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        dev: ["var(--font-devanagari)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
