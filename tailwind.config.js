/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", "./src/**/*.scss"],
	theme: {
		extend: {},
	},
	plugins: [],
	darkMode: "class", // Thay đổi từ 'media' thành 'class'
};
