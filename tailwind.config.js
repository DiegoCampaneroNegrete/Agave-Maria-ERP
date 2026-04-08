/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // lo forzaremos manualmente

  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './features/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        app: {
          bg: '#09090b',        // fondo principal (zinc-950)
          card: '#18181b',      // tarjetas (zinc-900)
          hover: '#27272a',     // hover (zinc-800)
          border: '#3f3f46',    // bordes (zinc-700)

          text: '#ffffff',      // texto principal
          muted: '#a1a1aa',     // texto secundario

          primary: '#16a34a',   // verde principal
          primaryHover: '#22c55e',

          danger: '#dc2626',    // rojo
        },
      },

      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },

      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },

      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '26px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
      },

      boxShadow: {
        card: '0 4px 12px rgba(0,0,0,0.3)',
      },

      transitionDuration: {
        200: '200ms',
      },
    },
  },

  plugins: [],
};