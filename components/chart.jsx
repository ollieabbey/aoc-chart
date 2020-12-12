import PropTypes from 'prop-types'
import { Scatter } from 'react-chartjs-2'
import { getCompletionTimes } from '../util/getCompletionTimes'
import { DateTime } from 'luxon'
import 'chartjs-adapter-luxon'


export default function Chart({ data }) {
	const allCompletionTimes = getCompletionTimes(data)
	const person = 'Ollie Abbey'
	const completionTimes = allCompletionTimes[person].map(timestamp => DateTime.fromSeconds(parseInt(timestamp)))
		.map((dateTime, index) => {
			return {
				t: dateTime,
				y: (index + 1)
			}
		})
	const plotData = {
		datasets: [
			{
				label: person,
				data: completionTimes,
				showLine: true,
				lineTension: 0,
				fill: false,
			}
		],
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
		}
	}
	return (
		<Scatter data={plotData} options={options}/>
	)
}

Chart.propTypes = {
	data: (PropTypes.object | PropTypes.func).isRequired
}