import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import { User } from '../../../shared/interfaces/user';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  user?: User;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.user$.subscribe(user => {
      this.user = user!;
    });
  }
}
