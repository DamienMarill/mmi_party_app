import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { map, take, filter, switchMap, of } from 'rxjs';
import { GroupUser, User } from '../interfaces/user';

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

/**
 * Guard that ensures students have completed their MMII profile.
 * Redirects to registration page if user is a student without MMII.
 */
export const profileCompleteGuard = () => {
  const router = inject(Router);
  const apiService = inject(ApiService);

  return apiService.user$.pipe(
    // Wait for user to be loaded (not null/undefined)
    filter((user): user is User => user !== null && user !== undefined),
    take(1),
    map(user => {
      console.log('[profileCompleteGuard] Checking user:', user);
      
      // Check if user is a student (mmi1, mmi2, mmi3)
      const studentGroups = [GroupUser.Mmi1, GroupUser.Mmi2, GroupUser.Mmi3];
      const isStudent = studentGroups.includes(user.groupe);

      console.log('[profileCompleteGuard] isStudent:', isStudent, 'mmii:', user.mmii);

      // If student without MMII, redirect to profile setup
      if (isStudent && !user.mmii) {
        console.log('[profileCompleteGuard] Redirecting to profile-setup');
        router.navigate(['/profile-setup']);
        return false;
      }

      return true;
    })
  );
};
