import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lootbox } from '../../../shared/interfaces/lootbox';

@Component({
  selector: 'app-recap',
  standalone: false,
  templateUrl: './recap.component.html',
  styleUrl: './recap.component.scss'
})
export class RecapComponent implements OnInit {
  lootbox?: Lootbox;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { lootbox: Lootbox } | undefined;

    // Alternative pour Firefox/cas où navigation est null après render
    const historyState = history.state as { lootbox?: Lootbox };

    if (state?.lootbox) {
      this.lootbox = state.lootbox;
    } else if (historyState?.lootbox) {
      this.lootbox = historyState.lootbox;
    } else {
      // Si on arrive sur cette page directement sans données (ex: refresh)
      this.router.navigate(['/home']);
    }
  }
}
