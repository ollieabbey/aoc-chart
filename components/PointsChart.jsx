import PropTypes from 'prop-types'
import { Scatter } from 'react-chartjs-2'
import { getPointsAtTimes } from '../util/getCompletionTimes'
import { DateTime } from 'luxon'
import 'chartjs-adapter-luxon'
import { options, dataSetOptions } from '../config/chartConfig'


export default function PointsChart({ data }) {
	const points = getPointsAtTimes(data)
	const datasets = []
	for (const person in points) {
		const pointTimes = points[person].map(array => [DateTime.fromSeconds(parseInt(array[0])), array[1]])
			.map(array => {
				return {
					t: array[0],
					y: array[1]
				}
			})
		const dataset = {
			label: person,
			data: pointTimes,
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

PointsChart.propTypes = {
	data: PropTypes.object.isRequired,
}