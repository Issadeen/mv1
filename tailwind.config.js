/** @type {import('tailwindcss').Config} */
module.exports = {
  // Content is now auto-detected in v4
  future: {
    // Enable v4 features
    colorMix: true,
    logicalProperties: true,
  },
  theme: {
    extend: {
      colors: {
        // Using P3 color space
        primary: {
          DEFAULT: 'oklch(65% 0.15 160)'
        }
      }
    },
  }
}