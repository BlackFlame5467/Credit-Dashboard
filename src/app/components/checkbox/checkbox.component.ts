import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CheckService } from '../../services/check.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent {
  constructor(private checkboxService: CheckService) {
    this.checkboxService.setCheckedState(false);
  }

  onChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checkboxService.setCheckedState(isChecked);
  }
}
