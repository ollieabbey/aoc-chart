export const getLeaderboardData = async () => {
	const session = process.env.AOC_SESSION
	if (!session) {
		// TODO - Add error boundary rather than exiting the process.
		console.error('AOC_SESSION environment variable unset.')
		process.exit(1)
	}
	const board = 496748 // Work
	// const board = 580350 // Mistakes Made
	const response = await fetch(`https://adventofcode.com/2020/leaderboard/private/view/${board}.json`, {
		headers: {
			cookie: `session=${session}`
		},
	})
	const data = await response.json()
	return {
		props: {
			data,
		}
	}
} 