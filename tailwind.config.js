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
          50: '#f0f4f4',
          100: '#dce5e5',
          200: '#b9cbcb',
          300: '#8aa8a8',
          400: '#5d8080',
          500: '#3d5a5a',
          600: '#344d4d',
          700: '#2b4040',
          800: '#223333',
          900: '#1a2727',
        },
        badge: {
          bg: '#ffffff',        // Clean white background
          surface: '#f8f6f3',   // Light warm surface
          primary: '#3d5a5a',   // Dark teal (from logo text)
          secondary: '#c9a86c', // Warm gold (from logo ring)
          accent: '#3d5a5a',    // Teal accent (alias)
          gold: '#c9a86c',      // Gold (alias)
          rose: '#9c7b70',      // Dusty mauve/rose
          cream: '#ffffff',     // Clean white
          beige: '#f8f6f3',     // Light warm beige
          leaf: '#536b6b',      // Muted teal-green (from leaves)
        }
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
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
        'badge': '0 25px 50px -12px rgba(61, 90, 90, 0.25)',
        'glow': '0 0 40px rgba(201, 168, 108, 0.3)',
        'soft': '0 4px 20px rgba(61, 90, 90, 0.1)',
      }
    },
  },
  plugins: [],
}

