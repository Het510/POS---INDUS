/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bk: {
          // Fixed brand colors (don't change with theme)
          red: '#D62300',
          'red-dark': '#A91B00',
          orange: '#F5821F',
          yellow: '#FFC72C',
          gold: '#C8962A',
          'gold-light': '#E8B84B',
          brown: '#2C1810',
          'brown-mid': '#4A2C1A',
          'brown-light': '#6B3F28',
          // Theme-aware colors (swap between dark/light via CSS variables)
          cream: 'rgb(var(--bk-cream) / <alpha-value>)',
          'cream-dark': 'rgb(var(--bk-cream-dark) / <alpha-value>)',
          dark: 'rgb(var(--bk-dark) / <alpha-value>)',
          'dark-2': 'rgb(var(--bk-dark-2) / <alpha-value>)',
          'dark-3': 'rgb(var(--bk-dark-3) / <alpha-value>)',
        }
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'serif'],
        'heading': ['"Oswald"', 'sans-serif'],
        'body': ['"Nunito"', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C8962A 0%, #E8B84B 50%, #C8962A 100%)',
        'dark-gradient': 'linear-gradient(180deg, rgb(var(--bk-dark)) 0%, rgb(var(--bk-dark-2)) 100%)',
        'hero-gradient': 'linear-gradient(135deg, rgb(var(--bk-dark)) 0%, #2C1810 40%, rgb(var(--bk-dark-2)) 100%)',
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(200, 150, 42, 0.3)',
        'gold-lg': '0 8px 40px rgba(200, 150, 42, 0.4)',
        'dark': '0 4px 20px rgba(0,0,0,0.6)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200,150,42,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(200,150,42,0)' },
        }
      }
    },
  },
  plugins: [],
}
