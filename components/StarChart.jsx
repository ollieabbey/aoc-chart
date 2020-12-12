import PropTypes from 'prop-types'
import { Scatter } from 'react-chartjs-2'
import 'chartjs-adapter-luxon'
import { options } from '../config/chartConfig'
import { cloneDeep, set } from 'lodash'

export default function StarChart({ datasets }) {
	const plotData = {
		datasets: datasets
	}
	const plotOptions = cloneDeep(options)
	set(plotOptions, 'scales.yAxes', [{
		scaleLabel: {
			display: true,
			labelString: 'Stars'
		}
	}])
	return (
		<Scatter data={plotData} options={plotOptions}/>
	)
}

StarChart.propTypes = {
	datasets: PropTypes.array.isRequired,
}