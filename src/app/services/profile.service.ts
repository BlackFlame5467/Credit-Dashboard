import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable, of, shareReplay } from 'rxjs'
import {
	IDateProfile,
	IPaginationProfile,
	IProfile,
} from '../interfaces/profile.interface'
import { getEndOfMonth, getFormatDate } from '../utils/format-date.util'
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'

@Injectable({
	providedIn: 'root',
})
export class ProfileService {
	http = inject(HttpClient)
	currentDate = new Date().toISOString().split('T')[0]
	pageSize: number = 10
	currentPage: number = 1
	private store$!: Observable<IProfile[]>

	getProfile(): Observable<IProfile[]> {
		if (this.store$) {
			return this.store$
		} else {
			this.store$ = this.http
				.get<IProfile[]>(
					'https://raw.githubusercontent.com/LightOfTheSun/front-end-coding-task-db/master/db.json'
				)
				.pipe(shareReplay(1))
			return this.store$
		}
	}

	getFilterProfiles(
		page: number,
		isChecked: boolean
	): Observable<IPaginationProfile> {
		this.currentPage = page
		return this.getProfile().pipe(
			map(profiles => {
				let filteredProfiles = isChecked
					? this.filterProfiles(profiles)
					: profiles

				return {
					profiles: filteredProfiles,
					totalCount: filteredProfiles.length,
					isChecked: isChecked,
				}
			})
		)
	}

	filterProfiles(profiles: IProfile[]): IProfile[] {
		return profiles.filter(profile => {
			return (
				profile.actual_return_date > profile.return_date ||
				(profile.return_date < this.currentDate && !profile.actual_return_date)
			)
		})
	}

	filterProfilesOnDate(date: string | NgbDateStruct): Observable<IProfile[]> {
		if (typeof date === 'string') {
			return this.getProfile()
		} else {
			const startDate: string = getFormatDate(date)
			const endDate: string = getEndOfMonth(date)

			return this.getProfile().pipe(
				map(profiles => {
					return profiles.filter(profile => {
						return (
							profile.issuance_date >= startDate &&
							profile.issuance_date <= endDate
						)
					})
				})
			)
		}
	}

	filterOnPeriod(
		fromDate: NgbDateStruct,
		toDate: NgbDateStruct,
		type: string,
		isChecked: boolean
	): Observable<IDateProfile[]> {
		const startDate: string = getFormatDate(fromDate)
		const endDate: string = getFormatDate(toDate)

		if (type === 'issuance') {
			return this.getProfile().pipe(
				map(profiles => {
					let filteredCheckedProfiles = isChecked
						? this.filterProfiles(profiles)
						: profiles
					let filteredProfiles = filteredCheckedProfiles.filter(profile => {
						return (
							profile.issuance_date >= startDate &&
							profile.issuance_date <= endDate
						)
					})
					return [
						{
							profiles: filteredProfiles,
							totalCount: filteredProfiles.length,
						},
					]
				})
			)
		} else if (type === 'return') {
			return this.getProfile().pipe(
				map(profiles => {
					let filteredCheckedProfiles = isChecked
						? this.filterProfiles(profiles)
						: profiles
					let filteredProfiles = filteredCheckedProfiles.filter(profile => {
						return (
							profile.actual_return_date >= startDate &&
							profile.actual_return_date <= endDate
						)
					})
					return [
						{
							profiles: filteredProfiles,
							totalCount: filteredProfiles.length,
						},
					]
				})
			)
		} else {
			return of([
				{
					profiles: [],
					totalCount: 0,
				},
			])
		}
	}

	paginationProfiles(profiles: IProfile[], currentPage: number): IProfile[] {
		const start = (currentPage - 1) * this.pageSize
		const end = start + this.pageSize
		return profiles.slice(start, end)
	}
}
