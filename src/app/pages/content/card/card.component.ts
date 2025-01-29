import { Component } from '@angular/core';
import {CardVersion} from '../../../shared/interfaces/card-version';
import {ApiService} from '../../../shared/services/api.service';
import {ActivatedRoute} from '@angular/router';
import {AssetsService} from '../../../shared/services/assets.service';
import {faLayerGroup} from '@fortawesome/pro-solid-svg-icons';
import {CardType} from '../../../shared/interfaces/card-template';

@Component({
  selector: 'app-card',
  standalone: false,

  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  cardVersion?: CardVersion;

  fa= {
    faLayerGroup
  }

  constructor(
    public apiService: ApiService,
    public route: ActivatedRoute,
    public assetsService: AssetsService
  ) {
    //get cardId from route
    this.route.params.subscribe(params => {
      this.apiService.request<CardVersion>('GET', '/collection/' + params['cardId'])
        .subscribe((response ) => {
          this.cardVersion = response;
        });
    });
  }

  protected readonly CardType = CardType;
}
