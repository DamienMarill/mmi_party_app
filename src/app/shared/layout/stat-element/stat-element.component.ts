import { Component, Input } from '@angular/core';
import {
  faCode,
  faComment,
  faCube,
  faFilm,
  faMobileScreenButton,
  faPalette,
  faPhone
} from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-stat-element',
  standalone: false,

  templateUrl: './stat-element.component.html',
  styleUrl: './stat-element.component.scss'
})
export class StatElementComponent {
  @Input()statElement: string = '';

  fa: any = {
    audiovisuel: faFilm,
    communication: faComment,
    dev: faCode,
    graphisme: faPalette,
    trois_d: faCube,
    ux_ui: faMobileScreenButton,
  }
}
