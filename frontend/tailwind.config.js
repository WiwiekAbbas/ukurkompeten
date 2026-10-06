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
        navy: {
          DEFAULT: '#1E3A5F',
          light: '#2C5282',
          dark: '#1A365D',
        },
        teal: {
          DEFAULT: '#2D9B8F',
          light: '#38B2AC',
          dark: '#28857A',
        },
        coral: '#F97066',
        amber: '#F59E0B',
        green: '#10B981',
      },
    },
  },
  plugins: [],
}
