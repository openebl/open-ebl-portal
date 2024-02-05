import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    "./stories/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        header: ['Inter'], //['var(--font-inter)'],
        content: ['Inter'], //['var(--font-inter)'],
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: '#0A35A2',
        secondary1: '#004DE3',
        secondary2: '#F86919',
        background: '#F7F9FB',
        'border-dark': '#738DBC',
        'border-light': '#DFE4E9',
        header: '#0A35A2',
        'header-text': '#FFF',
        main: '#18335E',
        light: '#607497',
        disabled: '#99AED2',
        hint: '#C9CFDA',
        link: '#004DE3',
        warning: '#E42525'
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config