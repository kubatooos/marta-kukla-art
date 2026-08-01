/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#121212', // base background, per brief
          900: '#171717',
          800: '#1d1d1c',
          700: '#2a2a28',
        },
        ivory: {
          DEFAULT: '#F3EFE6', // warm off-white — softer than pure white against graphite
          muted: '#a19c92',
        },
        neon: {
          pink: '#ff007f',
          acid: '#ccff00',
          turquoise: '#00f5d4',
        },
      },
      fontFamily: {
        // Display / editorial serif — carries the gallery voice, used at low weight per brief
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        // Utility face — small caps labels, meta data, buttons, price tags
        sans: ['"Jost"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.35em',
      },
      dropShadow: {
        'neon-pink': ['0 0 6px #ff007f', '0 0 22px #ff007f99'],
        'neon-acid': ['0 0 6px #ccff00', '0 0 22px #ccff0099'],
        'neon-turquoise': ['0 0 6px #00f5d4', '0 0 22px #00f5d499'],
      },
      transitionTimingFunction: {
        brush: 'cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
  plugins: [],
};
