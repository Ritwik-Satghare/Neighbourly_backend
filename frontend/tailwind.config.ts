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
        primary: "#006953",
        "primary-container": "#13846a",
        secondary: "#3c6751",
        tertiary: "#924538",
        surface: "#f9f9f8",
        "surface-low": "#f3f4f3",
        "surface-high": "#e7e8e7",
        "surface-card": "#ffffff",
        "ink-strong": "#191c1c",
        "ink-soft": "#3e4945",
        outline: "#bdc9c3",
        "primary-fixed": "#94f5d6",
        "secondary-container": "#bbeace",
        "tertiary-fixed": "#ffdad4",
      },
      fontFamily: {
        headline: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
      },
      boxShadow: {
        ambient: "0 0 32px rgba(25, 28, 28, 0.06)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #006953 0%, #13846a 100%)",
        "page-glow":
          "radial-gradient(circle at top left, rgba(148,245,214,0.38), transparent 35%), radial-gradient(circle at bottom right, rgba(187,234,206,0.45), transparent 30%)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
