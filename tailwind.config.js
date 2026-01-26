/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
        "*.{js,ts,jsx,tsx,mdx}"
    ],
  theme: {
    extend: {
      colors: {
        background: '#030304',
        foreground: '#fafafa',
        card: '#141417',
        'card-foreground': '#fafafa',
        popover: '#141417',
        'popover-foreground': '#fafafa',
        primary: '#a3e635',
        'primary-foreground': '#030304',
        secondary: '#00d4ff',
        'secondary-foreground': '#030304',
        muted: '#333333',
        'muted-foreground': '#b3b3b3',
        accent: '#a3e635',
        'accent-foreground': '#030304',
        border: '#333333',
        input: '#1f1f1f',
        ring: '#a3e635',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
