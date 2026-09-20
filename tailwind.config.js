/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        museum: {
          bg: '#08090C',
          surface: '#0F1117',
          card: '#151821',
          hover: '#1A1E29',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-subtle': 'rgba(255, 255, 255, 0.04)',
          text: '#EDE8DF',
          muted: '#8A909E',
          faint: '#4E5360',
        },
        archival: {
          amber: '#D4A373',
          'amber-subtle': 'rgba(212, 163, 115, 0.12)',
          'amber-bright': '#E5A93C',
          red: '#991B1B',
          'red-subtle': 'rgba(153, 27, 27, 0.15)',
        },
        receipt: {
          paper: '#F4F0E6',
          'paper-dark': '#EDE8DF',
          ink: '#141519',
          faint: '#6B6D76',
          rule: '#D6D1C4',
          stamp: '#991B1B',
        }
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Courier Prime', 'monospace'],
        sans: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'receipt-physical': '0 12px 30px -5px rgba(0, 0, 0, 0.6), 0 4px 10px -3px rgba(0, 0, 0, 0.4)',
        'vitrine': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'glow-amber-subtle': '0 0 20px -3px rgba(212, 163, 115, 0.15)',
      },
      letterSpacing: {
        'widest-plus': '0.2em',
        'archival': '0.12em',
      }
    },
  },
  plugins: [],
}
