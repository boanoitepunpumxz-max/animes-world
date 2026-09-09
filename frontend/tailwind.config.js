/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        aw: {
          bg:        '#0a0a0f',
          surface:   '#111118',
          card:      '#16161f',
          border:    '#1e1e2e',
          purple:    '#a855f7',
          magenta:   '#ec4899',
          pink:      '#f472b6',
          'purple-dark': '#7c3aed',
          'purple-light': '#c084fc',
          text:      '#e2e8f0',
          muted:     '#94a3b8',
          dim:       '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'aw-gradient': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        'aw-gradient-dark': 'linear-gradient(135deg, #7c3aed 0%, #be185d 100%)',
        'card-gradient': 'linear-gradient(to top, rgba(10,10,15,0.98) 0%, rgba(10,10,15,0.5) 60%, transparent 100%)',
        'hero-gradient': 'linear-gradient(to right, rgba(10,10,15,0.98) 40%, rgba(10,10,15,0.4) 80%, transparent 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideDown: { from: { opacity: 0, transform: 'translateY(-10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(168,85,247,0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(168,85,247,0.6), 0 0 50px rgba(236,72,153,0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
};
