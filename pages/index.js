import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { getLeaderboardData } from '../util/getLeaderboardData'
import StarChart from '../components/StarChart'
import PointsChart from '../components/PointsChart'
import AveragesTable from '../components/AveragesTable'
import Placings from '../components/Placings'
import PropTypes from 'prop-types'
import { getCompletionTimesAsArray, getPointsAtTimes } from '../util/getCompletionTimes'
import { getAverageTimesForMembers } from '../util/getAverageTimeForMembers'
import { DateTime } from 'luxon'
import { dataSetOptions } from '../config/chartConfig'
import { randomColour } from '../util/randomColour'
import { useState } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

const getStarChartDatasets = (data, colours) => {
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
		const colour = colours[person]
		const dataset = {
			label: person,
			data: completionTimes,
			backgroundColor: colour,
			borderColor: colour,
			...(dataSetOptions())
		}
		datasets.push(dataset)
	}
	return datasets
}

const getPointChartDataSets = (data, colours) => {
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
		const colour = colours[person]
		const dataset = {
			label: person,
			data: pointTimes,
			backgroundColor: colour,
			borderColor: colour,
			...(dataSetOptions())
		}
		datasets.push(dataset)
	}
	return datasets
}

export default function Home({ data }) {
	const personalData = data.personal
	const boardIds = Object.keys(data.boards)
	const haveBoards = boardIds.length > 0
	let avgTimes, pointsData, starData, boardId, setBoardId
	if (haveBoards) {
		[boardId, setBoardId] = useState({ value: boardIds[0], label: data.boards[boardIds[0]].owner})
		const boardData = data.boards[boardId.value].data
		const colours = {}
		for (const key in boardData.members) {
			const person = boardData.members[key]
			colours[person.name] = randomColour()
		}
		avgTimes = getAverageTimesForMembers(boardData)
		const getTotalMillisForName = name => {
			const dataForName = avgTimes.filter(data =>  data.name === name)
			if (dataForName.length > 0) {
				return dataForName[0].totalMillis
			}
		}
		pointsData = getPointChartDataSets(boardData, colours).sort((a,b) => getTotalMillisForName(a.label) - getTotalMillisForName(b.label))
		starData = getStarChartDatasets(boardData, colours).sort((a,b) => getTotalMillisForName(a.label) - getTotalMillisForName(b.label))
	}
	
	return (
		<div className={styles.container}>
			<Head>
				<title>AoC Leaderboard Page</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>
					Advent of Code Leaderboard Charts
				</h1>
				<Placings html={personalData}/>
				{haveBoards && <pre>Select leaderboard owner:</pre>}
				{haveBoards && <Dropdown options={boardIds.map(id => {
					return { value: id, label: data.boards[id].owner}
				})} onChange={setBoardId} value={boardId}/>}
				{haveBoards && <PointsChart datasets={pointsData} />}
				{haveBoards && <StarChart datasets={starData} />}
				{haveBoards && <AveragesTable datasets={avgTimes}/>}
			</main>

		</div>
	)
}

export async function getStaticProps() {
	return getLeaderboardData()
}

Home.propTypes = {
	data: PropTypes.object,
}
