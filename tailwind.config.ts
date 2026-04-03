import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange':     '#E8820C',
        'brand-yellow':     '#F5C518',
        'brand-red':        '#C0392B',
        'brand-brown-dark': '#3d1a00',
        'brand-brown-mid':  '#7a2800',
        'brand-cream':      '#FFF8F0',
      },
      fontFamily: {
        display: ['var(--font-lobster-two)', 'cursive'],
      },
    },
  },
  plugins: [],
}

export default config
