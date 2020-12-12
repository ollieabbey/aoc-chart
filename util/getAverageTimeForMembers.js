const { DateTime, Duration } = require('luxon')

const formatDuration = duration => {
	const hoursMinutesSeconds =  duration.toFormat('h m s').split(' ')
	const hours = hoursMinutesSeconds[0]
	const minutes = hoursMinutesSeconds[1]
	const seconds = hoursMinutesSeconds[2]
	return `${hours} hour${hours == 1 ? '' : 's'}, ${minutes} minute${minutes == 1 ? '' : 's'} and ${seconds} second${seconds == 1 ? '' : 's'}.`
}

const getAverageTimeOfCompletionForPerson = (personData) => {
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
		'Part 1': formatDuration(avgDuration1),
		'Part 2': formatDuration(avgDuration2),
		total: avgDuration1 + avgDuration2
	}
}

export const getAverageTimesForMembers = data => {
	const times = []
	for (const key in data.members) {
		const member = data.members[key]
		const timeData = getAverageTimeOfCompletionForPerson(member)
		if (timeData) {
			times.push(timeData)
		}
	}
	return times.sort((a,b) => a.total - b.total)
}