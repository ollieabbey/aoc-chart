export function randomColour () {
	const o = Math.round, r = Math.random, s = 255
	let red = o(r()*s)
	let blue = o(r()*s)
	let green = o(r()*s)
	while (red + blue + green > 760) {
		red = o(r()*s)
		blue = o(r()*s)
		green = o(r()*s)
	}
	return `rgba(${red},${blue},${green})`
}