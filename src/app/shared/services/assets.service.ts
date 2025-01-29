import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor() { }

  getBgUrl(path?: string): string{
    return environment.storage + '/background/' + path;
  }

  getCardImgUrl(path?: string): string{
    return environment.storage + '/card_image/' + path;
  }
}
