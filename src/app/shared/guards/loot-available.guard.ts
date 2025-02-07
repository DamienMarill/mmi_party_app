import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { LootService } from '../services/loot.service';

export const lootAvailableGuard: CanActivateFn = (route, state) => {
  const lootService = inject(LootService);
  const router = inject(Router);

  return lootService.apiService.request<any>('GET', '/me/loot/availability')
    .pipe(
      take(1),
      map(data => {
        if (data.available) {
          return true;
        }
        router.navigate(['/home']);
        return false;
      }),
      catchError(() => {
        router.navigate(['/home']);
        return of(false);
      })
    );
};
