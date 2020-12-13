import PropTypes from 'prop-types'
import styles from '../styles/Home.module.css'
import { useState } from 'react'

const HeaderRow = ({ requestSort }) => {
	return (
		<thead>
			<tr>
				<th onClick={() => requestSort('position')}>
                Position
				</th>
				<th onClick={() => requestSort('name')}>
                Name
				</th>
				<th onClick={() => requestSort('score')}>
                Score
				</th>
				<th onClick={() => requestSort('stars')}>
                Stars
				</th>
				<th onClick={() => requestSort('part1Millis')}>
                Part 1 Average
				</th>
				<th onClick={() => requestSort('part2Millis')}>
                Part 2 Average
				</th>
				<th onClick={() => requestSort('totalMillis')}>
                Overall Average
				</th>
				<th onClick={() => requestSort('fastestPart1Millis')}>
                Fastest Part 1
				</th>
				<th onClick={() => requestSort('fastestPart2Millis')}>
                Fastest Part 2
				</th>
			</tr>
		</thead>
	)
}

const DataRow = (data) => {
	return (
		<tr key={data.name}>
			<td>{data.position}</td>
			<td>{data.name}</td>
			<td>{data.score}</td>
			<td>{data.stars}</td>
			<td>{data['Part 1']}</td>
			<td>{data['Part 2']}</td>
			<td>{data.total}</td>
			<td>{data['Fastest Part 1']}</td>
			<td>{data['Fastest Part 2']}</td>
		</tr>
	)
}


export default function StatsTable({ datasets }) {
	const [sortConfig, setSortConfig] = useState({key: 'position', direction: 'ascending'})
	const sortedData = datasets.sort((a, b) => {
		const aValue = a[sortConfig.key]
		const bValue = b[sortConfig.key]
		const aValueToSortWith = (typeof aValue) === 'string' ? aValue.toLowerCase() : aValue
		const bValueToSortWith = (typeof bValue) === 'string' ? bValue.toLowerCase() : bValue
		if (aValueToSortWith < bValueToSortWith) {
			return sortConfig.direction === 'ascending' ? -1 : 1
		}
		if (aValueToSortWith > bValueToSortWith) {
			return sortConfig.direction === 'ascending' ? 1 : -1
		}
		return 0
	})
	const requestSort = key => {
		let direction = 'ascending'
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending'
		}
		setSortConfig({ key, direction })
	}
	return (
		<table className={styles.table}>
			<HeaderRow requestSort={requestSort}/>
			<tbody>{sortedData.map(data => DataRow(data))}</tbody>
		</table>
	)
}

StatsTable.propTypes = {
	datasets: PropTypes.array.isRequired,
}

DataRow.propTypes = {
	data: PropTypes.object.isRequired,
}

HeaderRow.propTypes = {
	requestSort: PropTypes.func.isRequired,
}