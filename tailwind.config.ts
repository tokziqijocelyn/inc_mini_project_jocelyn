import { type Config } from "tailwindcss";
const { fontFamily } = require('tailwindcss/defaultTheme')

export default {
  content: ['./src/**/*.tsx'],
  // theme: {
  //   extend: {
  //     fontFamily: {
  //       lexend: ['var(--font-lexend)', ...fontFamily.lexend],
  //     },
  //   },
  // },
  plugins: [],
} satisfies Config;
