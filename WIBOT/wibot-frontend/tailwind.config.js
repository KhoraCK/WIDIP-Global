/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#1A1A1A',
        'bg-secondary': '#141414',
        'bg-user-msg': '#2A2A2A',
        'bg-assistant-msg': '#232323',
        'bg-code': '#0D0D0D',
        'text-primary': '#E5E5E5',
        'text-secondary': '#A0A0A0',
        'accent': '#5B9EFF',
        'accent-hover': '#4A8DE8',
        'border': '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: '15px',
        code: '14px',
      },
      spacing: {
        'sidebar': '280px',
        'header': '60px',
        'input-bar': '80px',
      },
    },
  },
  plugins: [],
}
