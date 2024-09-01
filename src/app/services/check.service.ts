import { Injectable } from '@angular/core'
import { BehaviorSubject, filter, map } from 'rxjs'
import { IProfile } from '../interfaces/profile.interface'

@Injectable({
	providedIn: 'root',
})
export class CheckService {
	private isCheckedSource = new BehaviorSubject<boolean>(false)

	isChecked$ = this.isCheckedSource.asObservable()

	setCheckedState(isChecked: boolean) {
		this.isCheckedSource.next(isChecked)
	}

	constructor() {}
}
