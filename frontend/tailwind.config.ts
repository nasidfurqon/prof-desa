import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F4F9F4",
        secondary: {
          DEFAULT: "#1B5E20",
          light: "#2E7D32",
          dark: "#0F3D12",
        },
        accent: {
          DEFAULT: "#FFA000",
          dark: "#E68900",
        },
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
