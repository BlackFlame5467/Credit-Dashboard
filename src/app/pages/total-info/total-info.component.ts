import { CommonModule, DatePipe, DecimalPipe, JsonPipe } from '@angular/common'
import {
	Component,
	Directive,
	EventEmitter,
	inject,
	Input,
	OnDestroy,
	Output,
	QueryList,
	signal,
	ViewChildren,
} from '@angular/core'
import {
	NgbDate,
	NgbDateStruct,
	NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'
import { CheckboxComponent } from '../../components/checkbox/checkbox.component'
import { DatepickerComponent } from '../../components/datepicker/datepicker.component'
import { IDateProfile, IProfile } from '../../interfaces/profile.interface'
import { SortEvent } from '../../interfaces/sort.interface'
import { ProfileService } from '../../services/profile.service'
import { SortColumn, SortDirection } from '../../types/sort.type'
import { Subject, takeUntil } from 'rxjs'

const rotate: { [key: string]: SortDirection } = {
	asc: 'desc',
	desc: '',
	'': 'asc',
}

const compare = (v1: string | number, v2: string | number) =>
	v1 < v2 ? -1 : v1 > v2 ? 1 : 0

@Directive({
	selector: 'th[sortable]',
	standalone: true,
	host: {
		'[class.asc]': 'direction === "asc"',
		'[class.desc]': 'direction === "desc"',
		'(click)': 'rotate()',
	},
})
export class NgbdSortableHeader {
	@Input() sortable: SortColumn = ''
	@Input() direction: SortDirection = ''
	@Output() sort = new EventEmitter<SortEvent>()

	rotate() {
		this.direction = rotate[this.direction]
		this.sort.emit({ column: this.sortable, direction: this.direction })
	}
}

@Component({
	selector: 'app-total-info',
	standalone: true,
	imports: [
		DecimalPipe,
		JsonPipe,
		DatePipe,
		NgbdSortableHeader,
		CheckboxComponent,
		NgbPaginationModule,
		CommonModule,
		DatepickerComponent,
	],
	templateUrl: './total-info.component.html',
	styleUrl: './total-info.component.scss',
})
export class TotalInfoComponent implements OnDestroy {
	profileService = inject(ProfileService)

	destroy$ = new Subject<void>()

	profiles = signal<IProfile[]>([])
	displayedProfiles = signal<IProfile[]>([])

	currentDate = new Date().toISOString().split('T')[0]
	selectedFromDate = signal<NgbDateStruct | string>('')
	selectedToDate = signal<NgbDateStruct | string>('')
	type = signal<string>('')

	isChecked: boolean = false

	currentPage = signal<number>(1)
	pageSize: number = 10
	totalCount = signal<number>(0)

	constructor() {
		this.loadProfiles(this.currentPage())
	}

	@ViewChildren(NgbdSortableHeader)
	headers!: QueryList<NgbdSortableHeader>

	loadProfiles(page: number) {
		this.profileService
			.getFilterProfiles(page, this.isChecked)
			.pipe(takeUntil(this.destroy$))
			.subscribe(({ profiles, totalCount, isChecked }) => {
				this.profiles.set(profiles)
				this.totalCount.set(totalCount)
				this.isChecked = isChecked

				this.applyPagination()
			})
	}

	onSort({ column, direction }: SortEvent) {
		for (const header of this.headers) {
			if (header.sortable !== column) {
				header.direction = ''
			}
		}
		if (direction === '' || column === '') {
			if (this.selectedFromDate() && this.selectedToDate()) {
				this.profileService
					.filterOnPeriod(
						this.selectedFromDate() as NgbDateStruct,
						this.selectedToDate() as NgbDateStruct,
						this.type(),
						this.isChecked
					)
					.pipe(takeUntil(this.destroy$))
					.subscribe((data: IDateProfile[]) => {
						const { profiles, totalCount } = data[0]

						this.profiles.set(profiles)
						this.totalCount.set(totalCount)
						this.applyPagination()
					})
			} else {
				this.loadProfiles(this.currentPage())
			}
		} else {
			const sortedProfiles = [...this.profiles()].sort((a, b) => {
				const res = compare(a[column], b[column])
				return direction === 'asc' ? res : -res
			})
			this.profiles.set(sortedProfiles)
			this.applyPagination()
		}
	}

	onPageChange(page: number) {
		this.currentPage.set(page)
		this.applyPagination()
	}

	onCheckboxChange(newState: boolean) {
		this.isChecked = newState
		if (this.selectedFromDate() && this.selectedToDate()) {
			this.profileService
				.filterOnPeriod(
					this.selectedFromDate() as NgbDateStruct,
					this.selectedToDate() as NgbDateStruct,
					this.type(),
					this.isChecked
				)
				.pipe(takeUntil(this.destroy$))
				.subscribe((data: IDateProfile[]) => {
					const { profiles, totalCount } = data[0]

					this.profiles.set(profiles)
					this.totalCount.set(totalCount)
					this.applyPagination()
				})
		} else {
			this.loadProfiles(this.currentPage())
		}
	}

	onDateSelected(event: { fromDate: NgbDate; toDate: NgbDate; type: string }) {
		this.selectedFromDate.set(event.fromDate)
		this.selectedToDate.set(event.toDate)
		this.type.set(event.type)

		this.profileService
			.filterOnPeriod(
				this.selectedFromDate() as NgbDateStruct,
				this.selectedToDate() as NgbDateStruct,
				this.type(),
				this.isChecked
			)
			.pipe(takeUntil(this.destroy$))
			.subscribe((data: IDateProfile[]) => {
				const { profiles, totalCount } = data[0]

				this.profiles.set(profiles)
				this.totalCount.set(totalCount)
				this.applyPagination()
			})
	}

	applyPagination() {
		const start = (this.currentPage() - 1) * this.pageSize
		const end = start + this.pageSize
		this.displayedProfiles.set(this.profiles().slice(start, end))
	}

	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
}
