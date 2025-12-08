/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Based on SPEC_UI.md color palette
        primary: {
          bg: '#FFFFFF',
          secondary: '#F8FAFC',
          accent: '#EFF6FF',
        },
        border: '#E2E8F0',
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
        },
        accent: '#3B82F6',
        task: {
          bar: '#93C5FD',
          default: '#D1D5DB',
        },
        tab: {
          active: '#3B82F6',
          inactive: '#94A3B8',
        }
      },
    },
  },
  plugins: [],
}
