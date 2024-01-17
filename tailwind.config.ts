import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        header: ['var(--font-inter)'],
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: '#18335e',
        secondary: '#009bd2',
        background: '#F7F9FB',
        header: '#0A35A2',
        'header-text': '#FFF',
      },
    },
  },
  plugins: [],
} satisfies Config;
