const plugin = require('tailwindcss/plugin');

function createWidthUtility(matchUtilities, name, divisor) {
  matchUtilities(
    {
      [name]: (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return {};
        const width = 170 * (num / divisor);
        return { width: `${width}px` };
      },
    },
    {
      values: {},
      type: 'number',
    }
  );
}

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
    require('@tailwindcss/typography'),

    plugin(function ({ matchUtilities }) {
      createWidthUtility(matchUtilities, 'w-rating', 10);
      createWidthUtility(matchUtilities, 'w-difficulty', 100);
    }),
  ],
};