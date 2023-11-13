import { type Config } from "tailwindcss";

export default {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        lexend: ['var(--font-lexend)'],
      },
    },
  },
  plugins: [],
} satisfies Config;
