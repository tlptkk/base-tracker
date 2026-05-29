import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          blue: '#0052FF',
          dark: '#0A0A0A',
          card: '#111111',
          border: '#1E1E1E',
        }
      },
    },
  },
  plugins: [],
}
export default config
