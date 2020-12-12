import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { getLeaderboardData } from '../util/getLeaderboardData'
import { getAverageTimeData } from '../util/getAverageTimeData'
import PropTypes from 'prop-types'


export default function Home({ data }) {
	return (
		<div className={styles.container}>
			<Head>
				<title>AoC Leaderboard Page</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>
          Average Times:
				</h1>
			</main>

			<p className={styles.description}>
				<code className={styles.code}>{JSON.stringify(getAverageTimeData(data))}</code>
			</p>
       
		</div>
	)
}

export async function getStaticProps() {
	return getLeaderboardData()
}

Home.propTypes = {
	data: PropTypes.object,
}
