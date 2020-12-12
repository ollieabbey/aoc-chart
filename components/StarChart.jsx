import PropTypes from 'prop-types'
import { Scatter } from 'react-chartjs-2'
import { getCompletionTimesAsArray } from '../util/getCompletionTimes'
import { DateTime } from 'luxon'
import 'chartjs-adapter-luxon'
import { options, dataSetOptions } from '../config/chartConfig'


export default function StarChart({ data }) {
	const allCompletionTimes = getCompletionTimesAsArray(data)
	const datasets = []
	for (const person in allCompletionTimes) {
		const completionTimes = allCompletionTimes[person].map(timestamp => DateTime.fromSeconds(parseInt(timestamp)))
			.map((dateTime, index) => {
				return {
					t: dateTime,
					y: (index + 1)
				}
			})
		const dataset = {
			label: person,
			data: completionTimes,
			...(dataSetOptions())
		}
		datasets.push(dataset)
	}
	const plotData = {
		datasets: datasets
	}
	return (
		<Scatter data={plotData} options={options}/>
	)
}

StarChart.propTypes = {
	data: PropTypes.object.isRequired,
}