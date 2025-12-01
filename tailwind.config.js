/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef0fb',
          100: '#dde1f7',
          200: '#bbc3ef',
          300: '#99a5e7',
          400: '#6677d7',
          500: '#4455cb',
          600: '#3a48b0',
          700: '#303c94',
          800: '#263078',
          900: '#1c245c',
        },
        badge: {
          bg: '#ffffff',        // Light cream background
          surface: '#e6cfbc',   // Beige surface
          primary: '#4455cb',   // Blue - PRIMARY
          secondary: '#9b5d46', // Terracotta - SECONDARY
          accent: '#4455cb',    // Blue accent (alias)
          terracotta: '#9b5d46', // Terracotta brown (alias)
          rose: '#d09892',      // Dusty rose
          cream: '#ffffff',     // White
          beige: '#e6cfbc',     // Beige
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      boxShadow: {
        'badge': '0 25px 50px -12px rgba(155, 93, 70, 0.25)',
        'glow': '0 0 40px rgba(68, 85, 203, 0.2)',
        'soft': '0 4px 20px rgba(155, 93, 70, 0.1)',
      }
    },
  },
  plugins: [],
}

