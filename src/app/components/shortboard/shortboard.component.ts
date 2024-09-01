import { Component, Input } from '@angular/core';
import { IBoard } from '../../interfaces/board.interface';

@Component({
  selector: 'app-shortboard',
  standalone: true,
  imports: [],
  templateUrl: './shortboard.component.html',
  styleUrl: './shortboard.component.scss',
})
export class ShortboardComponent {
  @Input() board!: IBoard;
}
