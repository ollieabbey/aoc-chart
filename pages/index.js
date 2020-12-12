import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { getLeaderboardData } from '../util/getLeaderboardData'
import StarChart from '../components/StarChart'
import PropTypes from 'prop-types'
import { getPointsAtTimes } from '../util/getCompletionTimes'

export default function Home({ data }) {
	getPointsAtTimes(data)
	return (
		<div className={styles.container}>
			<Head>
				<title>AoC Leaderboard Page</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>
					Advent of Code Leaderboard Chart
				</h1>
				<StarChart data={data}/>
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
