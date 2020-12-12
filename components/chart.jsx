import PropTypes from 'prop-types'
import { Scatter } from 'react-chartjs-2'
import { getCompletionTimes } from '../util/getCompletionTimes'
import { DateTime } from 'luxon'
import 'chartjs-adapter-luxon'


export default function Chart({ data }) {
	const randomColour = () => {
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
	const allCompletionTimes = getCompletionTimes(data)
	const datasets = []
	for (const person in allCompletionTimes) {
		const completionTimes = allCompletionTimes[person].map(timestamp => DateTime.fromSeconds(parseInt(timestamp)))
			.map((dateTime, index) => {
				return {
					t: dateTime,
					y: (index + 1)
				}
			})
		const colour = randomColour()
		const dataset = {
			label: person,
			data: completionTimes,
			showLine: true,
			lineTension: 0,
			fill: false,
			backgroundColor: colour,
			borderColor: colour
		}
		datasets.push(dataset)
	}
	const plotData = {
		datasets: datasets
	}
	const options = {
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
	return (
		<Scatter data={plotData} options={options}/>
	)
}

Chart.propTypes = {
	data: (PropTypes.object | PropTypes.func).isRequired
}