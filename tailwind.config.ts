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
        background: '#f6f4f1',
        foreground: '#1f1c19',
        surface: '#fbfaf8',
        border: '#e4dfd7',
        muted: '#8d8377',
        primary: '#2f2a26',
        accent: '#8c6f56'
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem'
      },
      boxShadow: {
        soft: '0 12px 30px rgba(47, 42, 38, 0.08)'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
