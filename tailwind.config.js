module.exports = {
	/* TIP: Customize TailWind classes
	 * By setting theme variables in tailwind.config we can use custom TailWind
	 * classes
	 */
	theme: {
		extend: {
			colors: {
				// TIP: you can nest your properties.
				// Color scheme from https://coolors.co/05668d-028090-00a896-02c39a-f0f3bd
				primary: {
					default: "#028090",
					dark: "#05668D",
				},
				secondary: "#02C39A",
				dark: "#00A896",
				light: "#F0F3BD",
			},
		},
	},
	variants: {
		borderWidth: ["responsive", "last", "hover", "focus"],
	},
	plugins: [],
};
