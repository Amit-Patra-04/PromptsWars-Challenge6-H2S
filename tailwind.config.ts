import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      spacing: {
        "0": "0px",
        "25": "2px",
        "50": "4px",
        "75": "8px",
        "100": "12px",
        "150": "14px",
        "200": "16px",
        "300": "24px",
        "400": "32px",
        "500": "40px",
        "600": "48px",
        "700": "64px",
        "800": "80px",
        "900": "96px",
      },
      colors: {
        surface: {
          base: "#000000",
          1: "#181818",
          2: "#1F1F1F",
          3: "#272727",
          4: "#313131",
          amber: "#131209",
        },
        border: {
          subtle: "#272727",
          default: "#313131",
          strong: "#404040",
        },
      },
      transitionTimingFunction: {
        base: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        "500": "500ms",
        "300": "300ms",
      },
    },
  },
  plugins: [],
};

export default config;
