import { Component } from '@angular/core';
import {ApiService} from './shared/services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mmi_party_app';

  constructor(
    public apiService: ApiService
  ) {

  }
}
