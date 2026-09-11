import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        outbreak: {
          bg: "#0b0c0a",
          panel: "#141613",
          panel2: "#1b1e19",
          line: "#2a2d27",
          ash: "#8a8f85",
          fog: "#c6cac2",
          blood: "#b3231f",
          bloodBright: "#e2352d",
          military: "#3f4a34",
          militaryBright: "#5c6b4c",
          warn: "#c98a2b",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 20% 20%, rgba(179,35,31,0.08), transparent 45%), radial-gradient(circle at 80% 60%, rgba(63,74,52,0.10), transparent 50%)",
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 20px 40px -20px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
export default config;
