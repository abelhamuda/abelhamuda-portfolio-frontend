/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        neon: {
          red: '#ff3b3b',
          green: '#39ff14',
        }
      },
      animation: {
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 1s step-end infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        blink: {
          'from, to': { 'border-color': 'transparent' },
          '50%': { 'border-color': '#39ff14' }
        },
        glow: {
          'from': { 
            'text-shadow': '0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 15px #39ff14'
          },
          'to': { 
            'text-shadow': '0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 30px #39ff14'
          }
        }
      }
    },
  },
  plugins: [],
}