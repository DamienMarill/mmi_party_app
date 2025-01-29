import { Component } from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {CardInstance} from '../../../shared/interfaces/card-instance';

@Component({
  selector: 'app-collection',
  standalone: false,

  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss'
})
export class CollectionComponent {
  cards: CardInstance[] = [];

  constructor(
    private apiService: ApiService
  ) {
    this.apiService.request<CardInstance[]>('GET', '/collection')
      .subscribe((response ) => {
        this.cards = response;
      });
  }
}
