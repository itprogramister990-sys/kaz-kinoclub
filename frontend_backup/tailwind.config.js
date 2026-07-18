/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E50914',
          dark: '#141414',
          card: '#1a1a2e',
          surface: '#16213e',
          border: '#2a2a4a',
          gold: '#f5c518',
          muted: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        'card-gradient': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.95) 100%)',
        'brand-gradient': 'linear-gradient(135deg, #E50914 0%, #b50710 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f5c518 0%, #d4a017 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'card-hover': '0 20px 40px rgba(229, 9, 20, 0.3)',
        'glow-red': '0 0 30px rgba(229, 9, 20, 0.5)',
        'glow-gold': '0 0 20px rgba(245, 197, 24, 0.4)',
      },
    },
  },
  plugins: [],
};
