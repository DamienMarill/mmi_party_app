import { Injectable } from '@angular/core';
import {ApiService} from './api.service';

/**
 * Interface pour la réponse de l'API de disponibilité des lootboxes
 */
interface LootAvailabilityResponse {
  available: boolean;
  count: number;
  nextAvailableTime: string; // "18:35"
  nextAvailableDateTime: string; // ISO 8601 timestamp
  slotsInfo?: Array<{
    time: string;
    timestamp: string;
    used: boolean;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class LootService {
  private lootavailable: boolean = false;
  private nextLoot?: Date;
  private lootCount: number = 0;

  public get isLootAvailable(): boolean {
    return this.lootavailable;
  }
  private set isLootAvailable(value: boolean) {
    this.lootavailable = value;
  }

  /**
   * Nombre de boosters disponibles
   */
  public get availableLootCount(): number {
    return this.lootCount;
  }

  public get nextLootTime(): Date {
    return this.nextLoot!;
  }
  private set nextLootTime(value: string) {
    // Utiliser directement le timestamp ISO complet depuis l'API
    // Plus besoin de reconstruire la date manuellement
    this.nextLoot = new Date(value);
  }

  constructor(
    public apiService: ApiService
  ) {
    this.updateLootAvailability();
  }

  updateLootAvailability(): void {
    this.apiService.request<LootAvailabilityResponse>('GET','/me/loot/availability')
      .subscribe((data) => {
        console.log(data);
        this.isLootAvailable = data.available;
        this.lootCount = data.count;
        // Utiliser le timestamp ISO complet au lieu de l'heure seule
        this.nextLootTime = data.nextAvailableDateTime;
      });
  }
}
