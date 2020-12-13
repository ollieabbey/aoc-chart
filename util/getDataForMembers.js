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
	const durationsPart1 = {}
	const durationsPart2 = {}
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
			durationsPart1[day] = millisToCompletePart1
		}
		if (millisToCompletePart2 > 0) {
			durationsPart2[day] = millisToCompletePart2
		}
	}
	if (Object.keys(durationsPart1).length == 0) {
		return
	}
	if (Object.keys(durationsPart2).length == 0) {
		return
	}
	const durationsPart1Array = Object.keys(durationsPart1).map(key => durationsPart1[key])
	const durationsPart2Array = Object.keys(durationsPart2).map(key => durationsPart2[key])
	const avgDuration1 = durationsPart1Array.length > 0 ? Duration.fromMillis(durationsPart1Array.reduce((a,b) => a + b)/ durationsPart1Array.length) : undefined
	const avgDuration2 = durationsPart2Array.length > 0 ? Duration.fromMillis(durationsPart2Array.reduce((a,b) => a + b)/ durationsPart2Array.length) : undefined
	const fastestPart1Millis = durationsPart1Array.reduce((a, b) => Math.min(a,b))
	const fastestPart2Millis = durationsPart2Array.reduce((a, b) => Math.min(a,b))
	return {
		name: personData.name,
		score: personData.local_score,
		stars: personData.stars,
		'Part 1': formatDuration(avgDuration1),
		'Part 2': formatDuration(avgDuration2),
		total: formatDuration(avgDuration1.plus(avgDuration2)),
		'Fastest Part 1': `${formatDuration(Duration.fromMillis(fastestPart1Millis))} (Day ${Object.keys(durationsPart1).filter(day => durationsPart1[day] === fastestPart1Millis)[0]})`,
		'Fastest Part 2': `${formatDuration(Duration.fromMillis(fastestPart2Millis))} (Day ${Object.keys(durationsPart2).filter(day => durationsPart2[day] === fastestPart2Millis)[0]})`,
		part1Millis: avgDuration1,
		part2Millis: avgDuration2,
		totalMillis: avgDuration1 + avgDuration2,
		fastestPart1Millis: fastestPart1Millis,
		fastestPart2Millis: fastestPart2Millis,
	}
}

export const getDataForMembers = data => {
	const allMemberData = []
	for (const key in data.members) {
		const member = data.members[key]
		const memberData = getDataForPerson(member)
		if (memberData) {
			allMemberData.push(memberData)
		}
	}
	const scores = allMemberData.map(memberData => memberData.score).sort((a, b) => a - b)
	allMemberData.forEach(memberData => {
		memberData.position = scores.length - scores.indexOf(memberData.score)
	})
	return allMemberData.sort((a,b) => a.score - b.score)
}