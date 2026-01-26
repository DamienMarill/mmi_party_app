import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import { User } from '../../../shared/interfaces/user';
import {AssetsService} from '../../../shared/services/assets.service';
import {LootService} from '../../../shared/services/loot.service';
import { faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  user?: User;
  faCog = faCog;

  constructor(
    private apiService: ApiService,
    public assetsService: AssetsService,
    public lootService: LootService
  ) {

  }

  ngOnInit(): void {
    this.apiService.user$.subscribe(user => {
      this.user = user!;
    });
  }
}
