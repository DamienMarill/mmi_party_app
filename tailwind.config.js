/** @type {import('tailwindcss').Config} */
import marillUI from 'marill-ui-core'

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    marillUI()
  ],
}

