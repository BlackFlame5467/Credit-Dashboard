import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'

export function getFormatDate(date: NgbDateStruct): string {
	const { year, month, day } = date
	return `${year}-${padZero(month)}-${padZero(day)}`
}

export function getEndOfMonth(date: NgbDateStruct): string {
	const lastDate = new Date(date.year, date.month, 0).getDate()
	return `${date.year}-${padZero(date.month)}-${lastDate}`
}

export function getLastDayNgbDate(date: NgbDate): NgbDate {
	const year = date.year
	const month = date.month

	const lastDate = new Date(year, month, 0).getDate()

	return new NgbDate(year, month, lastDate)
}

export function padZero(value: number): string {
	return value < 10 ? `0${value}` : `${value}`
}
