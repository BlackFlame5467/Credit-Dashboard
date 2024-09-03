import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable, shareReplay } from 'rxjs'
import { IPaginationProfile, IProfile } from '../interfaces/profile.interface'

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
			console.log('Кэш')
			return this.store$
		} else {
			console.log('Сервер')
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

	paginationProfiles(profiles: IProfile[], currentPage: number): IProfile[] {
		const start = (currentPage - 1) * this.pageSize
		const end = start + this.pageSize
		return profiles.slice(start, end)
	}
}
