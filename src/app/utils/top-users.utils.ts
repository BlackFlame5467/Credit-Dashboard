import { IProfile, ITopProfiles } from '../interfaces/profile.interface'

export function biggestTotalCredits(profiles: IProfile[]): ITopProfiles[] {
	const userProfile = profiles.reduce((map, profile) => {
		if (!map[profile.user]) {
			map[profile.user] = []
		}
		map[profile.user].push(profile)
		return map
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
	const topProfiles = profiles
		.filter(profile => profile.actual_return_date)
		.map(profile => ({
			...profile,
			value: profile.percent,
		}))
		.sort((a, b) => b.percent - a.percent)
		.slice(0, 10)

	return topProfiles
}

export function expenseRatio(profiles: IProfile[]): ITopProfiles[] {
	return profiles
		.map(profile => ({
			...profile,
			value: profile.body ? profile.percent / profile.body : 0,
		}))
		.sort((a, b) => b.value - a.value)
		.slice(0, 10)
}
