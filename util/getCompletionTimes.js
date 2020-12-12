const getAverageTimeOfCompletionForPerson = personData => {
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

export const getCompletionTimes = data => {
	const times = {}
	for (const key in data.members) {
		const member = data.members[key]
		const timestamps = getAverageTimeOfCompletionForPerson(member)
		times[member.name] = timestamps
	}
	return times
}