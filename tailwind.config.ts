import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        // Semantic tokens - mapped to BBR palette
        background: '#faf9f7',
        foreground: '#1a1a1a',
        surface: '#ffffff',
        border: '#e5e0d8',
        muted: '#6b6356',
        primary: '#1a1a1a',
        accent: '#8b0000',

        // BBR brand colors
        bbr: {
          burgundy: '#8b0000',
          'burgundy-light': '#a52a2a',
          gold: '#b8860b',
          cream: '#faf9f7',
          charcoal: '#1a1a1a'
        },

        // Ink scale - warm grays that complement BBR
        ink: {
          50: '#faf9f7',
          100: '#f0ede8',
          200: '#e0dbd2',
          300: '#c8c0b3',
          400: '#a69b8a',
          500: '#857968',
          600: '#6b5f50',
          700: '#544a3e',
          800: '#3d362d',
          900: '#1a1a1a'
        }
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem'
      },
      boxShadow: {
        soft: '0 12px 30px rgba(26, 26, 26, 0.08)',
        ring: '0 0 0 1px rgba(107, 99, 86, 0.18)'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'serif']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideOut: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideIn: 'slideIn 0.3s ease-out',
        slideOut: 'slideOut 0.3s ease-in'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
