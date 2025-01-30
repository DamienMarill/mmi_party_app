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
  lootavailable?: boolean;

  constructor(
    private apiService: ApiService,
    public assetsService: AssetsService
  ) {
    this.apiService.request<any>('GET','/me/loot/availability')
      .subscribe((data) => {
        console.log(data);
        this.lootavailable = data.available;
      });
  }

  ngOnInit(): void {
    this.apiService.user$.subscribe(user => {
      this.user = user!;
    });
  }
}
