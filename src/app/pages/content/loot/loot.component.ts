import { Component } from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {Lootbox} from '../../../shared/interfaces/lootbox';
import {Router} from '@angular/router';
import {ConfettiService} from '../../../shared/services/confetti.service';
import {LootService} from '../../../shared/services/loot.service';

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
      private router: Router,
      private confettiService: ConfettiService,
      private lootService: LootService
    ) {
      this.apiService.request<Lootbox>('GET', '/me/loot')
        .subscribe((response) => {
          lootService.updateLootAvailability();

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
            this.fireworks();
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
      }else{
        this.fireworks();
      }
    }
  }

  fireworks(){
    switch (this.lootbox?.cards[this.count].card_version?.rarity) {
      case 'common':
        this.confettiService.cannon();
        break;
      case 'uncommon':
        this.confettiService.doubleCannon();
        break;
      case 'rare':
        this.confettiService.fireworks();
        break;
      case 'epic':
        this.confettiService.stars();
        break;
    }

  }
}
