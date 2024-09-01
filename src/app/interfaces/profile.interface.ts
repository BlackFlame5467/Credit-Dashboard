export interface IProfile {
	id: number
	user: string
	issuance_date: string
	return_date: string
	actual_return_date: string
	body: number
	percent: number
}

export interface IPaginationProfile {
	profiles: IProfile[]
	totalCount: number
	isChecked: boolean
}

export interface ITopProfiles {
	id: number
	user: string
	issuance_date: string
	return_date: string
	actual_return_date: string
	body: number
	percent: number
	value: number
}
