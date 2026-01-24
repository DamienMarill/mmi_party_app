import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { authGuard, publicOnlyGuard } from './auth.guard';
import { ApiService } from '../services/api.service';

describe('Auth Guards', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let apiServiceMock: { isAuthenticated$: BehaviorSubject<boolean> };

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    apiServiceMock = {
      isAuthenticated$: new BehaviorSubject<boolean>(false)
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ApiService, useValue: apiServiceMock }
      ]
    });
  });

  describe('authGuard', () => {
    const executeGuard = () =>
      TestBed.runInInjectionContext(() => authGuard());

    it('devrait être créé', () => {
      expect(executeGuard).toBeTruthy();
    });

    it('devrait autoriser l\'accès quand l\'utilisateur est authentifié', fakeAsync(() => {
      apiServiceMock.isAuthenticated$.next(true);

      let result: boolean | undefined;
      executeGuard().subscribe(value => {
        result = value as boolean;
      });
      tick();

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    }));

    it('devrait refuser l\'accès et rediriger vers /login quand non authentifié', fakeAsync(() => {
      apiServiceMock.isAuthenticated$.next(false);

      let result: boolean | undefined;
      executeGuard().subscribe(value => {
        result = value as boolean;
      });
      tick();

      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('devrait prendre uniquement la première valeur (take(1))', fakeAsync(() => {
      apiServiceMock.isAuthenticated$.next(true);

      let emissionCount = 0;
      executeGuard().subscribe(() => {
        emissionCount++;
      });
      tick();

      // Émettre une nouvelle valeur
      apiServiceMock.isAuthenticated$.next(false);
      tick();

      expect(emissionCount).toBe(1);
    }));
  });

  describe('publicOnlyGuard', () => {
    const executeGuard = () =>
      TestBed.runInInjectionContext(() => publicOnlyGuard());

    it('devrait être créé', () => {
      expect(executeGuard).toBeTruthy();
    });

    it('devrait autoriser l\'accès quand l\'utilisateur n\'est pas authentifié', fakeAsync(() => {
      apiServiceMock.isAuthenticated$.next(false);

      let result: boolean | undefined;
      executeGuard().subscribe(value => {
        result = value as boolean;
      });
      tick();

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    }));

    it('devrait refuser l\'accès et rediriger vers /home quand authentifié', fakeAsync(() => {
      apiServiceMock.isAuthenticated$.next(true);

      let result: boolean | undefined;
      executeGuard().subscribe(value => {
        result = value as boolean;
      });
      tick();

      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    }));

    it('devrait prendre uniquement la première valeur (take(1))', fakeAsync(() => {
      apiServiceMock.isAuthenticated$.next(false);

      let emissionCount = 0;
      executeGuard().subscribe(() => {
        emissionCount++;
      });
      tick();

      // Émettre une nouvelle valeur
      apiServiceMock.isAuthenticated$.next(true);
      tick();

      expect(emissionCount).toBe(1);
    }));
  });

  describe('comportement inverse authGuard vs publicOnlyGuard', () => {
    it('authGuard et publicOnlyGuard devraient avoir des comportements opposés', fakeAsync(() => {
      // Quand authentifié
      apiServiceMock.isAuthenticated$.next(true);

      let authResult: boolean | undefined;
      let publicResult: boolean | undefined;

      TestBed.runInInjectionContext(() => authGuard()).subscribe(value => {
        authResult = value as boolean;
      });

      TestBed.runInInjectionContext(() => publicOnlyGuard()).subscribe(value => {
        publicResult = value as boolean;
      });
      tick();

      expect(authResult).toBeTrue();
      expect(publicResult).toBeFalse();
    }));

    it('devrait avoir des comportements opposés quand non authentifié', fakeAsync(() => {
      // Quand non authentifié
      apiServiceMock.isAuthenticated$.next(false);

      let authResult: boolean | undefined;
      let publicResult: boolean | undefined;

      TestBed.runInInjectionContext(() => authGuard()).subscribe(value => {
        authResult = value as boolean;
      });

      TestBed.runInInjectionContext(() => publicOnlyGuard()).subscribe(value => {
        publicResult = value as boolean;
      });
      tick();

      expect(authResult).toBeFalse();
      expect(publicResult).toBeTrue();
    }));
  });
});
