/** @type {import('tailwindcss').Config} */
import marillUI from 'marill-ui-core'

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [{
      watercolor: {
        "primary": "#82A0D8",          // Bleu lavande doux
        "primary-focus": "#6B87C2",
        "primary-content": "#ffffff",

        "secondary": "#E4A5FF",        // Rose-violet pastel
        "secondary-focus": "#D190EE",
        "secondary-content": "#ffffff",

        "accent": "#95D1CC",           // Turquoise clair
        "accent-focus": "#7BC0BA",
        "accent-content": "#ffffff",

        "neutral": "#F9FAFB",          // Gris bleuté
        "neutral-focus": "#374151",
        "neutral-content": "#374151",

        "base-100": "#F3F2F5",      // Blanc pur
        "base-200": "#ACA7B7",      // Gris plus contrasté
        "base-300": "#655C7A",      // Gris encore plus foncé
        "base-content": "#17151C",

        // États avec leurs couleurs content
        "info": "#89B9E1",
        "info-content": "#193C5C",        // Bleu foncé pour contraste

        "success": "#9FC7B5",
        "success-content": "#1B4539",      // Vert foncé pour contraste

        "warning": "#F0C78E",
        "warning-content": "#734D1F",      // Orangé foncé pour contraste

        "error": "#F1A3A3",
        "error-content": "#7A2424",

        "--rounded-box": "1.5rem", // border radius rounded-box utility class, used in card and other large boxes
        "--rounded-btn": "0.75rem", // border radius rounded-btn utility class, used in buttons and similar element
        "--rounded-badge": "0.38rem", // border radius rounded-badge utility class, used in badges and similar
        "--animation-btn": "0.25s", // duration of animation when you click on button
        "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
        "--btn-text-case": "normal-case", // set default text transform for buttons
        "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
        "--border-btn": "1px", // border width of buttons
        "--tab-border": "1px", // border width of tabs
        "--tab-radius": "1rem", // border radius of tabs
      }
    }]
  },
  plugins: [
    marillUI()
  ],
}

