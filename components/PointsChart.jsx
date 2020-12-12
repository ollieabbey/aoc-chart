import PropTypes from 'prop-types'
import { Scatter } from 'react-chartjs-2'
import 'chartjs-adapter-luxon'
import { options } from '../config/chartConfig'
import { cloneDeep, set } from 'lodash'


export default function PointsChart({ datasets }) {
	const plotData = {
		datasets: datasets
	}
	const plotOptions = cloneDeep(options)
	set(plotOptions, 'scales.yAxes', [{
		scaleLabel: {
			display: true,
			labelString: 'Points'
		}
	}])
	return (
		<Scatter data={plotData} options={plotOptions}/>
	)
}

PointsChart.propTypes = {
	datasets: PropTypes.array.isRequired,
}