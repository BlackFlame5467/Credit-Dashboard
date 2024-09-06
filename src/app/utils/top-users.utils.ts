import { IProfile, ITopProfiles } from '../interfaces/profile.interface'

export function biggestTotalCredits(profiles: IProfile[]): ITopProfiles[] {
	const userProfile = profiles.reduce((acc, profile) => {
		if (!acc[profile.user]) {
			acc[profile.user] = []
		}
		acc[profile.user].push(profile)
		return acc
	}, {} as Record<string, IProfile[]>)

	const userCreditCount = Object.entries(userProfile).map(
		([user, profiles]: [string, IProfile[]]) => ({
			...profiles[0],
			value: profiles.length,
		})
	)

	userCreditCount.sort((a, b) => b.value - a.value)

	return userCreditCount.slice(0, 10)
}

export function biggestTotalPercents(profiles: IProfile[]): ITopProfiles[] {
	const userMap = profiles
		.filter(profile => profile.actual_return_date)
		.reduce((acc, profile) => {
			const userKey = profile.user

			if (acc[userKey]) {
				acc[userKey].percent += profile.percent
				acc[userKey].value = acc[userKey].percent
			} else {
				acc[profile.user] = {
					...profile,
					value: profile.percent,
				}
			}
			return acc
		}, {} as Record<string, ITopProfiles>)

	const topProfiles = Object.values(userMap)
		.sort((a, b) => b.value - a.value)
		.slice(0, 10)

	return topProfiles
}

export function expenseRatio(profiles: IProfile[]): ITopProfiles[] {
	const userMap = profiles.reduce((acc, profile) => {
		const userKey = profile.user

		const value = profile.body ? profile.percent / profile.body : 0

		if (acc[userKey]) {
			acc[userKey].value += value
			acc[userKey].percent += profile.percent
			acc[userKey].body += profile.body
		} else {
			acc[userKey] = {
				...profile,
				value: value,
			}
		}

		return acc
	}, {} as Record<string, ITopProfiles>)

	const topProfiles = Object.values(userMap)
		.map(profile => ({
			...profile,
			value: +(profile.body ? profile.percent / profile.body : 0).toFixed(2),
		}))
		.sort((a, b) => b.value - a.value)
		.slice(0, 10)

	return topProfiles
}
