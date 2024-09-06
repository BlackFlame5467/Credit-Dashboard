import { JsonPipe } from '@angular/common'
import { Component, computed, inject, OnDestroy, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
	NgbAlertModule,
	NgbCalendar,
	NgbDate,
	NgbDatepickerModule,
	NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap'
import { map, Observable, Subject, takeUntil } from 'rxjs'
import { ShortboardComponent } from '../../components/shortboard/shortboard.component'
import { IBoard } from '../../interfaces/board.interface'
import { IDateProfile, IProfile } from '../../interfaces/profile.interface'
import { ProfileService } from '../../services/profile.service'
import {
	averageCreditAmount,
	returnedCredits,
	totalCreditAmount,
	totalCreditSum,
	totalPercentAmount,
} from '../../utils/board.util'
import {
	getEndOfMonth,
	getFormatDate,
	getLastDayNgbDate,
} from '../../utils/format-date.util'
import { ITable } from '../../interfaces/table.interface'
import {
	biggestTotalCredits,
	biggestTotalPercents,
	expenseRatio,
} from '../../utils/top-users.utils'
import { TableComponent } from '../../components/table/table.component'
import { DatepickerComponent } from '../../components/datepicker/datepicker.component'

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
		DatepickerComponent,
	],
	templateUrl: './short-info.component.html',
	styleUrl: './short-info.component.scss',
})
export class ShortInfoComponent implements OnDestroy {
	profileService = inject(ProfileService)
	calendar = inject(NgbCalendar)

	destroy$ = new Subject<void>()

	selectedFromDate = signal<NgbDateStruct | string>('')
	selectedToDate = signal<NgbDateStruct | string>('')
	type = signal<string>('')

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

	onDateSelected(event: { fromDate: NgbDate; toDate: NgbDate; type: string }) {
		this.selectedFromDate.set(event.fromDate)
		this.selectedToDate.set(event.toDate)
		this.type.set(event.type)

		this.profileService
			.filterOnPeriod(
				this.selectedFromDate() as NgbDateStruct,
				this.selectedToDate() as NgbDateStruct,
				this.type()
			)
			.pipe(takeUntil(this.destroy$))
			.subscribe((data: IDateProfile[]) => {
				const { profiles, startDate, endDate } = data[0]
				this.profiles.set(profiles)
				this.selectedFromDate.set(startDate)
				this.selectedToDate.set(endDate)
			})
	}

	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
}
