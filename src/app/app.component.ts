import {Component, OnInit} from '@angular/core';
import {ApiService} from './shared/services/api.service';
import {EventCheckService} from './shared/services/event-check.service';
import {filter, skip} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'mmi_party_app';

  constructor(
    public apiService: ApiService,
    private eventCheckService: EventCheckService
  ) {}

  ngOnInit(): void {
    // Check events when user becomes authenticated (skip initial null state)
    this.apiService.isAuthenticated$.pipe(
      skip(1),
      filter(isAuth => isAuth)
    ).subscribe(() => {
      this.eventCheckService.checkAll();
    });
  }
}
