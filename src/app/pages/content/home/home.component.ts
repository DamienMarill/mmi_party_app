import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import { User } from '../../../shared/interfaces/user';
import {AssetsService} from '../../../shared/services/assets.service';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  user?: User;

  constructor(
    private apiService: ApiService,
    public assetsService: AssetsService
  ) {}

  ngOnInit(): void {
    this.apiService.user$.subscribe(user => {
      this.user = user!;
    });
  }
}
