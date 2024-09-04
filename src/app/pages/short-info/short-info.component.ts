import { JsonPipe } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
	NgbAlertModule,
	NgbDatepickerModule,
	NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap'
import { map, Observable } from 'rxjs'
import { ShortboardComponent } from '../../components/shortboard/shortboard.component'
import { IBoard } from '../../interfaces/board.interface'
import { IProfile } from '../../interfaces/profile.interface'
import { ProfileService } from '../../services/profile.service'
import {
	averageCreditAmount,
	returnedCredits,
	totalCreditAmount,
	totalCreditSum,
	totalPercentAmount,
} from '../../utils/board.util'
import { getEndOfMonth, getFormatDate } from '../../utils/format-date.util'
import { ITable } from '../../interfaces/table.interface'
import {
	biggestTotalCredits,
	biggestTotalPercents,
	expenseRatio,
} from '../../utils/top-users.utils'
import { TableComponent } from '../../components/table/table.component'

@Component({
	selector: 'app-short-info',
	standalone: true,
	imports: [
		ShortboardComponent,
		NgbDatepickerModule,
		NgbAlertModule,
		FormsModule,
		JsonPipe,
		TableComponent,
	],
	templateUrl: './short-info.component.html',
	styleUrl: './short-info.component.scss',
})
export class ShortInfoComponent {
	profileService = inject(ProfileService)
	date: NgbDateStruct | string = new Date().toISOString().split('T')[0]
	profiles = signal<IProfile[]>([])
	shortboards: IBoard[] = [
		{
			id: 1,
			title: 'Кількість кредитів: ',
			value: () => totalCreditAmount(this.profiles()),
		},
		{
			id: 2,
			title: 'Середня сума видачі кредитів: ',
			value: () => averageCreditAmount(this.profiles()),
		},
		{
			id: 3,
			title: 'Сума виданих кредитів: ',
			value: () => totalCreditSum(this.profiles()),
		},
		{
			id: 4,
			title: 'Сума нарахованих відсотків: ',
			value: () => totalPercentAmount(this.profiles()),
		},
		{
			id: 5,
			title: 'Кількість повернених кредитів: ',
			value: () => returnedCredits(this.profiles()),
		},
	]
	tables: ITable[] = [
		{
			id: 1,
			tableTitle: 'Кількість кредитів',
			title: 'Топ-10 користувачів за кількістю отриманих кредитів:',
			profiles: () => biggestTotalCredits(this.profiles()),
		},
		{
			id: 2,
			tableTitle: 'Сума сплачених відсотків',
			title: 'Топ-10 користувачів за сумою сплачених відсотків:',
			profiles: () => biggestTotalPercents(this.profiles()),
		},
		{
			id: 3,
			tableTitle: 'Коефіцієнт витрат',
			title: 'Топ-10 користувачів за коефіцієнтом витрат:',
			profiles: () => expenseRatio(this.profiles()),
		},
	]

	constructor() {
		this.profileService.filterProfilesOnDate(this.date).subscribe(profiles => {
			this.profiles.set(profiles)
		})
	}

	onChangeDate(newDate: NgbDateStruct) {
		this.date = newDate
		this.profileService.filterProfilesOnDate(this.date).subscribe(profiles => {
			this.profiles.set(profiles)
		})
	}
}
