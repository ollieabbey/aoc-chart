export const options = {
	scales: {
		xAxes: [{
			scaleLabel: {
				display: true,
				labelString: 'Date'
			},
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
		duration: 2000,
		easing: 'linear'
	},
	layout: {
		padding: {
			top: 60
		}
	}
}

export const dataSetOptions = () => {
	return {
		showLine: true,
		lineTension: 0,
		fill: false,
		
	}
}



