import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  public getApiUrl() {
    return environment.api;
  }
}
