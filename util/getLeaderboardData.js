import { DOMParser } from 'xmldom'


const getLeaderBoardIds = async () => {
	const session = process.env.AOC_SESSION
	if (!session) {
		// TODO - Add error boundary rather than exiting the process.
		console.error('AOC_SESSION environment variable unset.')
		process.exit(1)
	}
	const response = await fetch('https://adventofcode.com/2020/leaderboard/private', {
		headers: {
			cookie: `session=${session}`
		},
	})
	const html = await response.text()
	return Array.from(new DOMParser()
		.parseFromString(html, 'text/html')
		.getElementsByTagName('article')
		.item(0)
		.getElementsByTagName('div'))
		.map(element => {
			const urlParts = element.getElementsByTagName('a')
				.item(0)
				.getAttribute('href')
				.split('/')
			return urlParts[urlParts.length - 1]
		})
}

const getLeaderBoardDataForId = async boardId => {
	const session = process.env.AOC_SESSION
	if (!session) {
		// TODO - Add error boundary rather than exiting the process.
		console.error('AOC_SESSION environment variable unset.')
		process.exit(1)
	}
	const response = await fetch(`https://adventofcode.com/2020/leaderboard/private/view/${boardId}.json`, {
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
	const leaderboardIds = await getLeaderBoardIds()
	const boards = {}
	leaderboardIds.forEach(async id => {
		const data = await getLeaderBoardDataForId(id)
		boards[id] = {
			owner: data.members[data.owner_id].name,
			data: data
		}
	})
	return {
		props: {
			data: {
				boards: boards,
				personal: await getPersonalAveragePlacing()
			}
		}
	}
}