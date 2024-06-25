/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{ts,svelte}",
    "./src/routes/**/*.{ts,svelte}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("./theme")],
}

