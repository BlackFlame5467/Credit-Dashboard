import { CommonModule } from '@angular/common'
import {
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Inject,
	inject,
	Input,
	Output,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
	NgbCalendar,
	NgbDate,
	NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap'
import { ProfileService } from '../../services/profile.service'

@Component({
	selector: 'app-datepicker',
	standalone: true,
	imports: [NgbDatepickerModule, FormsModule, CommonModule],
	templateUrl: './datepicker.component.html',
	styleUrl: './datepicker.component.scss',
})
export class DatepickerComponent {
	@Input() title: string = ''
	@Input() type: string = ''
	@Output() dateSelected = new EventEmitter<{
		fromDate: NgbDate
		toDate: NgbDate
		type: string
	}>()

	isShow: boolean = false

	eRef = inject(ElementRef)

	calendar = inject(NgbCalendar)
	profileService = inject(ProfileService)

	hoveredDate: NgbDate | null = null
	fromDate: NgbDate = this.calendar.getToday()
	toDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', 10)

	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date
		} else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
			this.toDate = date
			this.dateSelected.emit({
				fromDate: this.fromDate,
				toDate: this.toDate,
				type: this.type,
			})
		} else {
			this.toDate = null
			this.fromDate = date
			this.dateSelected.emit({
				fromDate: this.fromDate,
				toDate: this.calendar.getToday(),
				type: this.type,
			})
		}
	}

	onChangeDatepicker() {
		this.isShow = !this.isShow
	}

	@HostListener('document:click', ['$event'])
	clickOutside(event: Event) {
		if (this.isShow && !this.eRef.nativeElement.contains(event.target)) {
			this.isShow = false
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate &&
			!this.toDate &&
			this.hoveredDate &&
			date.after(this.fromDate) &&
			date.before(this.hoveredDate)
		)
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate)
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		)
	}
}
