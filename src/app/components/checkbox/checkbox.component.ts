import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	QueryList,
	ViewChild,
	ViewChildren,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
	selector: 'app-checkbox',
	standalone: true,
	imports: [FormsModule, CommonModule],
	templateUrl: './checkbox.component.html',
	styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent {
	@Input() isChecked: boolean = false
	@Output() checkedChange = new EventEmitter<boolean>()

	onChange(event: Event) {
		const isChecked = (event.target as HTMLInputElement).checked
		this.checkedChange.emit(isChecked)
	}
}
