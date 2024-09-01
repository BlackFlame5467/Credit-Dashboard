import { IProfile } from '../interfaces/profile.interface'
import { formatNumber } from './format-number.util'

export function totalCreditAmount(profiles: IProfile[]): number {
	return profiles.length
}
export function averageCreditAmount(profiles: IProfile[]): string {
	const totalAmount = profiles.reduce((sum, profile) => sum + profile.body, 0)
	const res = profiles.length ? totalAmount / profiles.length : 0

	return `${formatNumber(res)} грн.`
}

export function totalCreditSum(profiles: IProfile[]): string {
	const sum = profiles.reduce((sum, profile) => sum + profile.body, 0)
	return `${formatNumber(sum)} грн.`
}

export function totalPercentAmount(profiles: IProfile[]): string {
	const sum = profiles.reduce((sum, profile) => sum + profile.percent, 0)
	return `${formatNumber(sum)} грн.`
}

export function returnedCredits(profiles: IProfile[]): number {
	return profiles.filter(profile => profile.actual_return_date).length
}
