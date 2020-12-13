const { DateTime, Duration } = require('luxon')

const formatDuration = duration => {
	const hoursMinutesSeconds =  duration.toFormat('h m s').split(' ')
	const hours = hoursMinutesSeconds[0]
	const minutes = hoursMinutesSeconds[1]
	const seconds = hoursMinutesSeconds[2]
	return `${hours}h, ${minutes}m, ${seconds}s`
}

const getDataForPerson = (personData) => {
	const days = personData.completion_day_level
	const durationsPart1 = []
	const durationsPart2 = []
	for (const day in days) {
		const millisOpened = DateTime.fromObject(
			{
				year: 2020,
				month: 12,
				day: day,
				hour: 5,
				zone: 'UTC'
			}).toMillis()
		const timestamp1 = days[day]?.['1']?.get_star_ts || 0
		const timestamp2 = days[day]?.['2']?.get_star_ts || 0
		const millisToCompletePart1 = (timestamp1*1000) - (millisOpened)
		const millisToCompletePart2 = (timestamp2*1000) - (timestamp1*1000)
		if (millisToCompletePart1 > 0) {
			durationsPart1.push(millisToCompletePart1)
		}
		if (millisToCompletePart2 > 0) {
			durationsPart2.push(millisToCompletePart2)
		}
	}
	if (!durationsPart1 || durationsPart1.length === 0) {
		return
	}
	if (!durationsPart2 || durationsPart2.length === 0) {
		return
	}
	const avgDuration1 = durationsPart1.length > 0 ? Duration.fromMillis(durationsPart1.reduce((a,b) => a + b)/ durationsPart1.length) : undefined
	const avgDuration2 = durationsPart2.length > 0 ? Duration.fromMillis(durationsPart2.reduce((a,b) => a + b)/ durationsPart1.length) : undefined
	return {
		name: personData.name,
		score: personData.local_score,
		stars: personData.stars,
		'Part 1': formatDuration(avgDuration1),
		'Part 2': formatDuration(avgDuration2),
		total: formatDuration(avgDuration1.plus(avgDuration2)),
		part1Millis: avgDuration1,
		part2Millis: avgDuration2,
		totalMillis: avgDuration1 + avgDuration2
	}
}

export const getDataForMembers = data => {
	const times = []
	for (const key in data.members) {
		const member = data.members[key]
		const memberData = getDataForPerson(member)
		if (memberData) {
			times.push(memberData)
		}
	}
	const scores = times.map(memberData => memberData.score).sort((a, b) => a - b)
	times.forEach(memberData => {
		memberData.position = scores.length - scores.indexOf(memberData.score)
	})
	return times.sort((a,b) => a.score - b.score)
}