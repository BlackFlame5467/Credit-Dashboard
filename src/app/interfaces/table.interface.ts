import { IProfile, ITopProfiles } from './profile.interface'

export interface ITable {
	id: number
	title: string
	tableTitle: string
	profiles: () => ITopProfiles[]
}
