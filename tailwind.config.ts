import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d4d8e0",
          300: "#a9b1bf",
          400: "#7a8497",
          500: "#525b6c",
          600: "#3c4452",
          700: "#2a313c",
          800: "#1b2029",
          900: "#0e1218",
          950: "#06080c",
        },
        brand: {
          50: "#eef5ff",
          100: "#d9e8ff",
          200: "#bcd6ff",
          300: "#8ebbff",
          400: "#5994ff",
          500: "#356eff",
          600: "#1f4ef5",
          700: "#1a3ce0",
          800: "#1c34b4",
          900: "#1d328e",
          950: "#161f54",
        },
        ember: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Inter", "sans-serif"],
        display: ["ui-sans-serif", "system-ui", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.18)",
        glow: "0 0 0 1px rgba(53,110,255,0.35), 0 12px 40px -12px rgba(53,110,255,0.45)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%), radial-gradient(circle at 1px 1px, rgba(15,23,42,0.08) 1px, transparent 0)",
        "hero-mesh":
          "radial-gradient(60% 50% at 20% 10%, rgba(53,110,255,0.18) 0%, transparent 60%), radial-gradient(50% 50% at 90% 30%, rgba(249,115,22,0.18) 0%, transparent 60%), radial-gradient(50% 70% at 50% 100%, rgba(28,52,180,0.20) 0%, transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
