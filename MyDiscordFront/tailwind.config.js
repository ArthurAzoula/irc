/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: {
          white: "#E8E5FF"
        },
        background: {
          white: "#F5F3FF",
          black: "#122135",
        },
        primary: {
          500: '#4234F5',
          400: '#765EFF',
          300: '#A495FF',
          200: '#EBE5FF',
          100: '#F5F3FF',
        },

        secondary: {
          500: '#CID63C',
          400: '#CDDD6C',
          300: '#FFEI144',
          200: '#EDE68C',
          100: '#F8FFCE',  
        },

        neutral_black: {
          500: '#05CB14',
          400: '#122135',
          300: '#2E4159',
          200: '#747D99',
          100: '#949CB4',
        },

        neutral_white: {
          500: '#ADB3CB',
          400: '#C7CCDA',
          300: '#D7CCDA',
          200: '#F5F7FC',
          100: '#FFFFF',
        },

        success: {
          500: '#40BF45',
          400: '#4DA856',
          300: '#5AC264',
          200: '#7AD490',
          100: '#EFFEF7',
        },

        error: {
          500: '#B61508',
          400: '#FFB600',
          300: '#EA2110',
          200: '#FF9289',
          100: '#FFE4E1',
        },

        warning: {
          500: '#EBA625',
          400: '#DA9C23',
          300: '#FFA900',
          200: '#FFD37E',
          100: '#FFEBC5',
        },
      },

      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },

      fontSize: {
        '48': '3rem', 
        '29.37': ['1.8125rem', { lineHeight: '2.25rem' }], 
        '18.34': ['1.125rem', { lineHeight: '1.75rem' }], 
        '11.33': ['0.6875rem', { lineHeight: '1.25rem' }], 
        '14': '0.875rem',
      },

      fontWeight: {
        'light': 300,
        'regular': 400, 
        'semi-bold': 500, 
        'bold': 600,
      },

      plugins: [
        function ({ addUtilities }) {
          const newUtilities = {
            '.h1': {
              fontSize: '3rem',
              fontWeight: '600',
              fontFamily: 'Poppins, sans-serif',
            },
            '.h2': {
              fontSize: '1.8125rem',
              lineHeight: '2.25rem',
              fontWeight: '500',
              fontFamily: 'Poppins, sans-serif',
            },
            '.h3': {
              fontSize: '1.125rem',
              lineHeight: '1.75rem',
              fontWeight: '500',
              fontFamily: 'Poppins, sans-serif',
            },
            '.h4': {
              fontSize: '0.6875rem',
              lineHeight: '1.25rem',
              fontWeight: '300',
              fontFamily: 'Poppins, sans-serif',
            },
            '.body': {
              fontSize: '0.875rem',
              fontFamily: 'Poppins, sans-serif',
            },
          };
    
          addUtilities(newUtilities, ['responsive', 'hover']);
        },
      ],
    },
  },
};