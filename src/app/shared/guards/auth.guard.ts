import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { map, take } from 'rxjs/operators';

export const authGuard = () => {
  const router = inject(Router);
  const apiService = inject(ApiService);

  return apiService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }

      router.navigate(['/login']);
      return false;
    })
  );
};

export const publicOnlyGuard = () => {
  const router = inject(Router);
  const apiService = inject(ApiService);

  return apiService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        return true;
      }

      router.navigate(['/home']);
      return false;
    })
  );
};
