/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg: {
          base: '#0d0f14',
          surface: '#13161d',
          elevated: '#1a1e27',
          border: '#252a37',
        },
        accent: {
          DEFAULT: '#7fffb2',
          dim: '#4dcc88',
          glow: 'rgba(127,255,178,0.15)',
        },
        muted: '#4a5168',
        text: {
          primary: '#e8eaf0',
          secondary: '#8b91a8',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(127,255,178,0.1)',
        'glow-md': '0 0 40px rgba(127,255,178,0.15)',
      },
    },
  },
  plugins: [],
}
