/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      colors: {
        indigo: {
          950: '#1e1b4b'
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
        'brand-gradient-h': 'linear-gradient(to right, #4f46e5, #7c3aed, #a855f7)',
        'dark-sidebar': 'linear-gradient(180deg, #0f0c29 0%, #1a1040 50%, #24243e 100%)',
        'card-shimmer': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
      },
      boxShadow: {
        'brand': '0 8px 32px rgba(79, 70, 229, 0.35)',
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.15)',
        'glow': '0 0 40px rgba(139, 92, 246, 0.3)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.4s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        fadeUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
}
