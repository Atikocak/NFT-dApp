const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens: {
      sm: "480px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px"
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontFamily: {
        varela: ["Varela Round", ...defaultTheme.fontFamily.sans],
        coiny: ["Coiny", ...defaultTheme.fontFamily.sans],
        open_sans: ["Open Sans", ...defaultTheme.fontFamily.sans]
      },
      colors: {
        "brand-light": "var(--clr-light)",
        "brand-soft": "var(--clr-soft-violet)",
        "brand-mint": "var(--clr-middle-blue-green)",
        "brand-violet": "var(--clr-light-violet)",
        "brand-silk": "var(--clr-unbleached-silk)",
        "brand-hard": "var(--clr-violet)",
        "brand-image": "var(--clr-image)",
        "brand-background": "var(--clr-background)"
      },
      animation: {
        "pulse-slow": "pulse 10s linear infinite",
        "bounce-slow": "bounce 4s linear infinite",
        wiggle: "wiggle .5s ease 0s infinite alternate",
        "bounce-fast": "bounce_fast 1s linear infinite"
      },
      keyframes: {
        wiggle: {
          "0%": { transform: "rotate(15deg) scale(1)" },
          "100%": { transform: "rotate(5deg) scale(1.05)" }
        }
      },
      boxShadow: {
        extra: "5px 5px 0 rgba(0, 0, 0, 0.2)"
      }
    }
  },
  plugins: [
    // require("flowbite/plugin")
  ]
}
