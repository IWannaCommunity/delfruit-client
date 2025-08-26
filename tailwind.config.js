const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
	  preflight: false,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
	"./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
			fontFamily: {
        verdana: ['Verdana', 'Arial', 'sans-serif']
      },
			backgroundImage: {
				'footer-bg': "url('/images/GaidenBG.png')",
				'news-bg': "url('/images/NewsReelBG.png')"
			},
			screens: {
				"3xl": "2000px"
			}
	},
	container: {
		center: true
	},
	fontFamily: {
		sans: ['Prompt', 'sans-serif']
	},
	fontSize: {
		'lg': ['18px', {
			lineHeight: '27px'
		}],
		'2xl': ['24px', {
			lineHeight: '36px'
		}],
		'xl': ['20px', {
			lineHeight: '30px'
		}],
		'header': ['32px', {
			lineHeight: '48px'
		}],
		'4xl': ['36px', {
			lineHeight: '54px'
		}]
	}
  },
  variants: {
    fill: ['hover', 'focus']
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
};