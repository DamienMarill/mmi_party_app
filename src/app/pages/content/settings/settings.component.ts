import { Component } from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {MmiiShape} from '../../../shared/interfaces/mmii-shape';

@Component({
  selector: 'app-settings',
  standalone: false,

  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  mmiiShape?: MmiiShape;
  background?: string;

  constructor(
      public apiService: ApiService
    ) {
      this.apiService.user$.subscribe(user => {
        if (user?.mmii){
          this.mmiiShape = user.mmii.shape;
          this.background = user.mmii.background;
        }
      });
    }

    changeMMiiShape(shape: MmiiShape) {
      this.mmiiShape = shape;
      const req = {
        shape: shape,
        background: this.background
      };

      this.apiService.request('PUT', '/mmii/parts', shape).subscribe(() => {

      });
    }

    changeBackground(background: string) {
      this.background = background;
      if (this.mmiiShape){
        this.changeMMiiShape(this.mmiiShape);
      }
    }
}
