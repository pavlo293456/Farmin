import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        farm: {
          green: '#2d6a4f',
          light: '#74c69d',
          cream: '#f8f4ec',
          brown: '#6b4226',
          accent: '#f4a261',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.08)',
        hover: '0 8px 32px rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [],
}

export default config
