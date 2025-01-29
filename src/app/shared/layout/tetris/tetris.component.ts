import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-tetris',
  standalone: false,

  templateUrl: './tetris.component.html',
  styleUrl: './tetris.component.scss'
})
export class TetrisComponent {
  @Input()size: string = '1.5rem';
  @Input()shape?: boolean[][] = [];
}
