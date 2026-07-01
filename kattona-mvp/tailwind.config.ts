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
        brand: {
          DEFAULT: '#007AFF',
          dark:    '#0056CC',
          light:   '#E5F0FF',
        },
        ink: {
          DEFAULT: '#1C1C1E',
          secondary: '#3C3C43',
          tertiary: '#6B6B6B',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F2F2F7',
          tertiary: '#E5E5EA',
        },
        success: { DEFAULT: '#34C759', light: '#E8F9ED' },
        warning: { DEFAULT: '#FF9500', light: '#FFF4E5' },
        danger:  { DEFAULT: '#FF3B30', light: '#FFF0EF' },
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"',
          '"Segoe UI"', 'Roboto', 'sans-serif',
        ],
        mono: ['"SF Mono"', '"Fira Code"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['3.5rem',  { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-lg': ['2.75rem', { lineHeight: '1.08', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-md': ['2rem',    { lineHeight: '1.1',  letterSpacing: '-0.02em',  fontWeight: '700' }],
        'display-sm': ['1.5rem',  { lineHeight: '1.2',  letterSpacing: '-0.015em', fontWeight: '600' }],
        'body-lg':    ['1.0625rem', { lineHeight: '1.65' }],
        'body-md':    ['0.9375rem', { lineHeight: '1.6' }],
        'body-sm':    ['0.8125rem', { lineHeight: '1.55' }],
        'caption':    ['0.75rem',   { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'overline':   ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '600' }],
      },
      borderRadius: {
        'xl':  '14px',
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
      },
      boxShadow: {
        'card':  '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
        'modal': '0 24px 64px rgba(0,0,0,0.18)',
        'input-focus': '0 0 0 3px rgba(0,122,255,0.2)',
      },
      animation: {
        'fade-in':   'fadeIn 0.2s ease-out',
        'slide-up':  'slideUp 0.28s cubic-bezier(0.16,1,0.3,1)',
        'slide-down':'slideDown 0.22s ease-out',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                  to: { opacity: '1' } },
        slideUp:   { from: { transform: 'translateY(20px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { from: { transform: 'translateY(-10px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
      },
      spacing: {
        'safe-top':    'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}

export default config
