/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
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
	}
  },
  plugins: [require('@tailwindcss/forms')],
}