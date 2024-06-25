const plugin = require('tailwindcss/plugin')

const base = {
  ":root": {
    "color-scheme": "light",
    "--rounded-box": "1rem",
    "--rounded-input": ".5rem",
    "--rounded-btn": ".5rem",
    "--animation-btn": ".25s",
    "--animation-input": ".2s",
    "--neutral": "43 52 64",
    "--neutral-fg": "213 214 217",
    "--primary": "73 30 255",
    "--primary-fg": "219 210 255",
    "--info": "0 179 240",
    "--info-fg": "0 36 48",
    "--success": "0 169 111",
    "--success-fg": "0 34 22",
    "--warning": "255 194 45",
    "--warning-fg": "51 39 9",
    "--error": "255 111 112",
    "--error-fg": "51 22 22",
    "--base1": "255 255 255",
    "--base2": "242 242 242",
    "--base3": "229 230 230",
    "--basec": "31 41 55",
    "--toast-z-index": "1000",
    "--dialog-z-index": "9000",
  },
  "h1": {
    "font-size": "48px",
    "line-height": "1",
    "font-weight": "800",
  },
  "h2": {
    "font-size": "36px",
    "line-height": "40px",
    "font-weight": 700,
  },
  "h3": {
    "--tw-text-opacity": "1",
    "font-size": "30px",
    "line-height": "36px",
    "font-weight": 700,
    "color": "rgb(163 163 163 / var(--tw-text-opacity))",
  }
}

const utils = {
  ".full-screen": {
    "position": "fixed",
    "inset": "0px",
    "display": "flex",
    "flex-direction": "column",
    "align-items": "center",
    "justify-content": "center",
  },
  ".rounded-box": {
    "border-radius": "var(--rounded-box)",
  },
  ".rounded-t-box": {
    "border-top-left-radius": "var(--rounded-box)",
    "border-top-right-radius": "var(--rounded-box)",
  },
  ".rounded-b-box": {
    "border-bottom-left-radius": "var(--rounded-box)",
    "border-bottom-right-radius": "var(--rounded-box)",
  },
  ".rounded-l-box": {
    "border-top-left-radius": "var(--rounded-box)",
    "border-bottom-left-radius": "var(--rounded-box)",
  },
  ".rounded-r-box": {
    "border-top-right-radius": "var(--rounded-box)",
    "border-bottom-right-radius": "var(--rounded-box)",
  },
  ".rounded-input": {
    "border-radius": "var(--rounded-input)",
  },
  ".rounded-btn": {
    "border-radius": "var(--rounded-btn)",
  },
  ".no-animation": {
    "--animation-btn": "0",
    "--animation-input": "0",
  },
}

module.exports = plugin(function({ addUtilities, addBase }) {
  addBase(base)
  addUtilities(utils)
}, {
  theme: {
    extend: {
      colors: {
        "neutral-50": "#fafafa",
        "neutral-100": "#f5f5f5",
        "neutral-200": "#e5e5e5",
        "neutral-300": "#d4d4d4",
        "neutral-400": "#a3a3a3",
        "neutral-500": "#737373",
        "neutral-600": "#525252",
        "neutral-700": "#404040",
        "neutral-800": "#262626",
        "neutral-900": "#171717",
        "neutral-950": "#0a0a0a",
        "base-100": "rgb(var(--base1) / <alpha-value>)",
        "base-200": "rgb(var(--base2) / <alpha-value>)",
        "base-300": "rgb(var(--base3) / <alpha-value>)",
        "base-content": "rgb(var(--basec) / <alpha-value>)",
        "primary": "rgb(var(--primary) / <alpha-value>)",
        "primary-content": "rgb(var(--primary-fg) / <alpha-value>)",
        "neutral": "rgb(var(--neutral) / <alpha-value>)",
        "neutral-content": "rgb(var(--neutral-fg) / <alpha-value>)",
        "info": "rgb(var(--info) / <alpha-value>)",
        "info-content": "rgb(var(--info-fg) / <alpha-value>)",
        "success": "rgb(var(--success) / <alpha-value>)",
        "success-content": "rgb(var(--success-fg) / <alpha-value>)",
        "warning": "rgb(var(--warning) / <alpha-value>)",
        "warning-content": "rgb(var(--warning-fg) / <alpha-value>)",
        "error": "rgb(var(--error) / <alpha-value>)",
        "error-content": "rgb(var(--error-fg) / <alpha-value>)",
      }
    }
  }
})