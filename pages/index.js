import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { getLeaderboardData } from '../util/getLeaderboardData'
import StarChart from '../components/StarChart'
import PointsChart from '../components/PointsChart'
import AveragesTable from '../components/AveragesTable'
import PropTypes from 'prop-types'
import { getCompletionTimesAsArray, getPointsAtTimes } from '../util/getCompletionTimes'
import { getAverageTimesForMembers } from '../util/getAverageTimeForMembers'
import { DateTime } from 'luxon'
import { dataSetOptions } from '../config/chartConfig'
import { randomColour } from '../util/randomColour'

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
	return datasets.sort((a,b) => a.person > b.person)
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
	return datasets.sort((a,b) => a.person > b.person)
}

export default function Home({ data }) {
	const colours = {}
	for (const key in data.members) {
		const person = data.members[key]
		colours[person.name] = randomColour()
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
				<PointsChart datasets={getPointChartDataSets(data, colours)} />
				<StarChart datasets={getStarChartDatasets(data, colours)} />
				<AveragesTable datasets={getAverageTimesForMembers(data)}/>
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
