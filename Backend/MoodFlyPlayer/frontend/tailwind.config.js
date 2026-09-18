/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0b0f17",
        canvas: "#0b0f17",
        surface: "#0f131c",
        "surface-dim": "#0a0e16",
        "surface-low": "#131722",
        "surface-container": "#161b26",
        "surface-high": "#1e2433",
        "surface-highest": "#242c3d",
        primary: {
          DEFAULT: "#10b981",
          light: "#4edea3",
          dark: "#059669",
          container: "#00422b",
        },
        secondary: {
          DEFAULT: "#06b6d4",
          light: "#4cd7f6",
          dark: "#0891b2",
        },
        tertiary: {
          DEFAULT: "#a855f7",
          light: "#ddb7ff",
          dark: "#7e22ce",
        },
        "on-surface": "#f8fafc",
        "on-surface-variant": "#94a3b8",
        outline: "#333d4e",
      },
      fontFamily: {
        headline: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'Inter'", "'Plus Jakarta Sans'", "sans-serif"],
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
