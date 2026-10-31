/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aviation: {
          dark: '#0B132B',
          navy: '#1C2541',
          slate: '#3A506B',
          cyan: '#5BC0BE',
          accent: '#6FFFE9',
          danger: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981',
          card: '#111827',
          surface: '#1F2937'
        }
      }
    },
  },
  plugins: [],
}
