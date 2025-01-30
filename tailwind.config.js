/** @type {import('tailwindcss').Config} */
import marillUI from 'marill-ui-core'

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  safelist: [
    { pattern: /border-rarity-[a-z]*/ },
    { pattern: /shadow-rarity-[a-z]*/ },
    { pattern: /bg-rarity-[a-z]*/ },
    { pattern: /text-stats-[a-z_]*-[a-z]*/ },
    { pattern: /border-stats-[a-z_]*-[a-z]*/ },
    { pattern: /bg-stats-[a-z_]*-[a-z]*/ },
  ],
  theme: {
    extend: {
      colors: {
        stats: {
          dev: {
            dark: "#6EC89B",
            light: "#DFEAE2"
          },
          ux_ui: {
            dark: "#9575CD",
            light: "#BFA2E6"
          },
          graphisme:{
            dark: "#5C9BE6",
            light: "#A0C4F2",
          },
          audiovisuel: {
            dark: "#E57373",
            light: "#E8CDCD",
          },
          trois_d: {
            dark: "#4DB6AC",
            light: "#BCDDE2",
          },
          communication: {
            dark: "#D1A054",
            light: "#EAD9B9",
          },
        },
        rarity: {
          'common': '#FFC5D6',
          'uncommon': '#FF998E',
          'rare': '#91CDE3',
          'epic': '#FFC985',
        }
      },
    },
    animation: {
      'gradient-xy': 'gradient-xy 15s ease infinite',
    },
    keyframes: {
      'gradient-xy': {
        '0%, 100%': {
          'background-size': '400% 400%',
          'background-position': 'left center'
        },
        '50%': {
          'background-size': '200% 200%',
          'background-position': 'right center'
        }
      }
    }
  },
  daisyui: {
    themes: [{
      watercolor: {
        "primary": "#91CDE3",          // Bleu lavande doux
        // "primary-focus": "#6B87C2",
        // "primary-content": "#ffffff",

        "secondary": "#FFC985",        // Rose-violet pastel
        // "secondary-focus": "#D190EE",
        // "secondary-content": "#ffffff",

        "accent": "#FFC5D6",           // Turquoise clair
        // "accent-focus": "#7BC0BA",
        // "accent-content": "#ffffff",

        "neutral": "#F9FAFB",          // Gris bleuté
        "neutral-focus": "#374151",
        "neutral-content": "#28201E",

        "base-100": "#FEFCFA",      // Blanc pur
        "base-200": "#C6B7AC",      // Gris plus contrasté
        "base-300": "#8E7F70",      // Gris encore plus foncé
        "base-content": "#28201E",

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

