import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#07080A",
          raised: "#0E1014",
          line: "rgba(237, 234, 227, 0.12)",
        },
        paper: {
          DEFAULT: "#EDEAE3",
          muted: "rgba(237, 234, 227, 0.64)",
          faint: "rgba(237, 234, 227, 0.52)",
        },
        signal: {
          DEFAULT: "#FF7A2F",
          deep: "#C94A0A",
        },
        ember: "#FF7A2F",
        cream: {
          DEFAULT: "#F4F1EA",
          dark: "#E8E4DB",
        },
        ink: {
          DEFAULT: "#151515",
          muted: "#4A4A4A",
          faint: "#8A8A8A",
        },
        accent: {
          DEFAULT: "#0A78B5",
          hover: "#086090",
          light: "#E8F4FA",
        },
        surface: {
          DEFAULT: "#F4F1EA",
          dark: "#1A1A1A",
          "dark-elevated": "#242424",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "mega": ["clamp(3.5rem, 13vw, 15rem)", { lineHeight: "0.85", letterSpacing: "-0.055em" }],
        "hero": ["clamp(2.6rem, 6.6vw, 7.5rem)", { lineHeight: "0.92", letterSpacing: "-0.045em" }],
        "display-xl": [
          "clamp(2.75rem, 5vw + 1rem, 5.5rem)",
          { lineHeight: "1.12", letterSpacing: "-0.022em" },
        ],
        "display-lg": [
          "clamp(2.125rem, 4vw, 3.25rem)",
          { lineHeight: "1.15", letterSpacing: "-0.018em" },
        ],
        "display-md": [
          "clamp(1.75rem, 3vw, 2.375rem)",
          { lineHeight: "1.2", letterSpacing: "-0.015em" },
        ],
      },
      spacing: {
        section: "clamp(3.25rem, 5.5vw, 4.375rem)",
      },
      maxWidth: {
        content: "1360px",
        prose: "42rem",
      },
      borderColor: {
        rule: "#15151520",
        "rule-dark": "#FFFFFF15",
        "accent-rule": "#0A78B540",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
