import { Injectable } from '@angular/core';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LootService {
  private lootavailable: boolean = false;

  public get isLootAvailable(): boolean {
    return this.lootavailable;
  }
  private set isLootAvailable(value: boolean) {
    this.lootavailable = value;
  }

  constructor(
    public apiService: ApiService
  ) {
    this.apiService.request<any>('GET','/me/loot/availability')
      .subscribe((data) => {
        console.log(data);
        this.isLootAvailable = data.available;
      });
  }
}
