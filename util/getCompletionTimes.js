const getCompletionTimesForPerson = personData => {
	const days = personData.completion_day_level
	const timestamps = []
	for (const day in days) {
		['1', '2'].forEach(part => {
			const timestamp = days[day]?.[part]?.get_star_ts
			if (timestamp) {
				timestamps.push(timestamp)
			}
		})
	}
	return timestamps.sort()
}

/**
 * {
 *   "Alice": [1000, 1005, 2004, 2201],
 *   "Bob": [1005, 1060, 2004, 2501]
 * }
 */
export const getCompletionTimesAsArray = data => {
	const times = {}
	for (const key in data.members) {
		const member = data.members[key]
		const timestamps = getCompletionTimesForPerson(member)
		times[member.name] = timestamps
	}
	return times
}

const getCompletionTimesForDayAndPart = (data, day, part) => {
	const times = []
	for (const key in data.members) {
		const member = data.members[key]
		const dayData = member.completion_day_level[day]
		if (dayData) {
			const partData = dayData[part]
			if (partData) {
				times.push(partData.get_star_ts)
			}
		}
	}
	return times.sort()
}

/**
 * {
 *   "Alice": [[1000, 20], [1005, 39], [2004, 48], [2201, 65]]
 * }
 */
export const getPointsAtTimes = data => {
	const numberOfParticipants = Object.keys(data.members).length

	// Get the timestamps at which each puzzle was completed
	const dayPartCompletionTimes = {}
	for (let day = 1; day < 26; day++) {
		const dayTimes = {}
		const part1 = getCompletionTimesForDayAndPart(data, day, 1)
		const part2 = getCompletionTimesForDayAndPart(data, day, 2)
		if (part1.length > 0) {
			dayTimes['1'] = part1
		}
		if (part2.length > 0) {
			dayTimes['2'] = part2
		}
		if (Object.keys(dayTimes).length > 0) {
			dayPartCompletionTimes[day] = dayTimes
		}
	}
	
	// For each person, get the points they earned for completing each puzzle
	const pointsEarned = {}
	for (const key in data.members) {
		const pointsEarnedByMember = []
		const member = data.members[key]
		const days = member.completion_day_level
		for (const day in days) {
			// Zero points awarded for day 1, but comment this out if you want them
			if (day === '1') {
				continue
			}
			if (days[day]['1']) {
				const part1Time = days[day]['1'].get_star_ts
				if (part1Time) {
					const pointsEarnedForPart1 = numberOfParticipants - dayPartCompletionTimes[day]['1'].indexOf(part1Time)
					pointsEarnedByMember.push([part1Time, pointsEarnedForPart1])
				}
			}
			if (days[day]['2']) {
				const part2Time = days[day]['2'].get_star_ts
				if (part2Time) {
					const pointsEarnedForPart2 = numberOfParticipants - dayPartCompletionTimes[day]['2'].indexOf(part2Time)
					pointsEarnedByMember.push([part2Time, pointsEarnedForPart2])
				}
			}
		}
		if (pointsEarnedByMember.length > 0) {
			pointsEarned[member.name] = pointsEarnedByMember.sort((a,b) => a[0] > b[0]).map((value, index, array) => {
				const scoreAtIndex = array.slice(0, index + 1).map(it => it[1]).reduce((a,b) => a+b)
				return [value[0], scoreAtIndex]
			})
		}
	}
	return pointsEarned
}

