import { Component } from '@angular/core';
import {NotificationService} from '../../../shared/services/notification.service';
import {firstValueFrom} from 'rxjs';
import { faBell, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {Location} from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: false,

  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  isLoadingNotif = false;
  faBell = faBell;
  faArrowLeft = faArrowLeft;
  
  constructor(
      public notificationService: NotificationService,
      public location: Location
    ) {
    }

    async toggleNotifications() {
      this.isLoadingNotif = true;
      try {
        const isSubscribed = await firstValueFrom(this.notificationService.isSubscribed$);
        if (isSubscribed) {
          await this.notificationService.unsubscribe();
        } else {
          await this.notificationService.subscribe();
        }
      } finally {
        this.isLoadingNotif = false;
      }
    }

    goBack() {
      this.location.back();
    }
}
