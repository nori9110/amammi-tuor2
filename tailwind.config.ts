import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B6B',
          dark: '#FF5252',
          light: '#FF8E8E',
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          dark: '#3AB8B0',
          light: '#6EDDD5',
        },
        accent: {
          DEFAULT: '#FF8E53',
          dark: '#FF7740',
          light: '#FFA570',
        },
        pastel: {
          50: '#F0F8FF',
          100: '#E6F3FF',
          200: '#CCE7FF',
          300: '#B0E0E6',
          400: '#87CEEB',
          500: '#7EC8E3',
          600: '#5FA8D0',
          700: '#4A90C2',
          800: '#2E5C8A',
          900: '#1E3A5F',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Hiragino Kaku Gothic ProN"',
          '"Hiragino Sans"',
          'Meiryo',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
export default config;

