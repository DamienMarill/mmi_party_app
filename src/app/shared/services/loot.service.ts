import { Injectable } from '@angular/core';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LootService {
  private lootavailable: boolean = false;
  private nextLoot?: Date;

  public get isLootAvailable(): boolean {
    return this.lootavailable;
  }
  private set isLootAvailable(value: boolean) {
    this.lootavailable = value;
  }

  public get nextLootTime(): Date {
    return this.nextLoot!;
  }
  private set nextLootTime(value: string) {
    // Construire la date d'aujourd'hui avec l'heure fournie
    const [hours, minutes] = value.split(':');
    const today = new Date();

    // Si l'heure est déjà passée, on passe au lendemain
    const nextDate = new Date(today.setHours(Number(hours), Number(minutes), 0));
    if (nextDate < new Date()) {
      nextDate.setDate(nextDate.getDate() + 1);
    }

    this.nextLoot = nextDate;
  }

  constructor(
    public apiService: ApiService
  ) {
    this.updateLootAvailability();
  }

  updateLootAvailability(): void {
    this.apiService.request<any>('GET','/me/loot/availability')
      .subscribe((data) => {
        console.log(data);
        this.isLootAvailable = data.available;
        this.nextLootTime = data.nextAvailableTime;
      });
  }
}
