import { randomColour } from '../util/randomColour'

export const options = {
	scales: {
		xAxes: [{
			type: 'time',
			time: {
				unit: 'day',
				unitStepSize: 1,
				displayFormats: {
					'day': 'MMM DD'
				}
			}
		}]
	},
	animation: {
		duration: 1000,
		easing: 'linear'
	}
}

export const dataSetOptions = () => {
	const colour = randomColour()
	return {
		showLine: true,
		lineTension: 0,
		fill: false,
		backgroundColor: colour,
		borderColor: colour
	}
}



