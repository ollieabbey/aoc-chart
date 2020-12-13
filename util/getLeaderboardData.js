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
	const idToName = {}
	Array.from(new DOMParser()
		.parseFromString(html, 'text/html')
		.getElementsByTagName('article')
		.item(0)
		.getElementsByTagName('div'))
		.forEach(element => {
			const urlParts = element.getElementsByTagName('a')
				.item(0)
				.getAttribute('href')
				.split('/')
			const id = urlParts[urlParts.length - 1]
			// console.log(JSON.stringify(element))
			idToName[id] = element.lastChild.data
		})
	return idToName
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
	Object.keys(leaderboardIds).forEach(async id => {
		boards[id] = {
			owner: leaderboardIds[id],
			data: await getLeaderBoardDataForId(id)
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