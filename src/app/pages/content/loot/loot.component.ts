import { Component } from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {Lootbox} from '../../../shared/interfaces/lootbox';
import {Router} from '@angular/router';

@Component({
  selector: 'app-loot',
  standalone: false,

  templateUrl: './loot.component.html',
  styleUrl: './loot.component.scss'
})
export class LootComponent {
    lootbox?: Lootbox;

    count= 0;
    showOrbe: boolean[] = [];
    isLoaded = false;

    constructor(
      private apiService: ApiService,
      private router: Router
    ) {
      this.apiService.request<Lootbox>('GET', '/me/loot')
        .subscribe((response) => {
          for (let i = 0; i < response.cards.length; i++) {
            this.showOrbe.push(false);
          }
          this.lootbox = response;

          for (let i = 0; i < this.lootbox.cards.length; i++) {
            setTimeout(() => {
              this.showOrbe[i] = true;
            }, 300 * i);
          }
          setTimeout(() => {
            this.isLoaded = true;
          }, 300 * this.lootbox.cards.length+1);
        });
    }

  getPosition(index: number) {
    const angle = (360 / 5) * index;
    const radius = 150;
    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);

    return {
      left: `${50 + (x / radius) * 50}%`,
      top: `${50 + (y / radius) * 50}%`,
      transform: `translate(-50%, -50%) rotate(-${angle}deg)`
    };
  }

  passCard() {
    if (this.count < (this.lootbox?.cards.length || 0)) {
      this.showOrbe[this.count] = false;
      this.count++;

      if (this.count === this.lootbox?.cards.length) {
        setTimeout(() => {
          this.router.navigate(['/collection']);
        }, 300);
      }
    }
  }
}
