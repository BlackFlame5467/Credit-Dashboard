import { Component, Input } from '@angular/core'
import { ITable } from '../../interfaces/table.interface'

@Component({
	selector: 'app-table',
	standalone: true,
	imports: [],
	templateUrl: './table.component.html',
	styleUrl: './table.component.scss',
})
export class TableComponent {
	@Input() table!: ITable
}
