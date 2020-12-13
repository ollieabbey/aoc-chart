import { board } from '../config/leaderboardConfig'

const getPrivateLeaderboardData = async () => {
	const session = process.env.AOC_SESSION
	if (!session) {
		// TODO - Add error boundary rather than exiting the process.
		console.error('AOC_SESSION environment variable unset.')
		process.exit(1)
	}
	const response = await fetch(`https://adventofcode.com/2020/leaderboard/private/view/${board}.json`, {
		headers: {
			cookie: `session=${session}`
		},
	})
	return await response.json()
} 

const getPersonalAveragePlacing = async () => {
	const session = process.env.AOC_SESSION
	if (!session) {
		// TODO - Add error boundary rather than exiting the process.
		console.error('AOC_SESSION environment variable unset.')
		process.exit(1)
	}
	const response = await fetch('https://adventofcode.com/2020/leaderboard/self', {
		headers: {
			cookie: `session=${session}`
		},
	})
	return await response.text()
}

export const getLeaderboardData = async () => {
	return {
		props: {
			data: {
				board: await getPrivateLeaderboardData(),
				personal: await getPersonalAveragePlacing()
			}
		}
	}
}