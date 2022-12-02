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
		}
	},
	container: {
		center: true
	}
  },
  plugins: [require('@tailwindcss/forms')],
}