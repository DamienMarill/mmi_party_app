import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';

import { lootAvailableGuard } from './loot-available.guard';
import { LootService } from '../services/loot.service';
import { ApiService } from '../services/api.service';

describe('lootAvailableGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let lootServiceMock: { apiService: jasmine.SpyObj<ApiService> };

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/loot' } as RouterStateSnapshot;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['request']);
    lootServiceMock = {
      apiService: apiServiceSpy
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: LootService, useValue: lootServiceMock }
      ]
    });
  });

  const executeGuard = (): Observable<boolean> => {
    return TestBed.runInInjectionContext(() =>
      lootAvailableGuard(mockRoute, mockState)
    ) as Observable<boolean>;
  };

  it('devrait être créé', () => {
    lootServiceMock.apiService.request.and.returnValue(of({ available: true }));
    expect(executeGuard).toBeTruthy();
  });

  describe('quand le loot est disponible', () => {
    it('devrait autoriser l\'accès', fakeAsync(() => {
      lootServiceMock.apiService.request.and.returnValue(of({ available: true }));

      let result: boolean | undefined;
      executeGuard().subscribe((value: boolean) => {
        result = value;
      });
      tick();

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    }));
  });

  describe('quand le loot n\'est pas disponible', () => {
    it('devrait refuser l\'accès et rediriger vers /home', fakeAsync(() => {
      lootServiceMock.apiService.request.and.returnValue(of({ available: false }));

      let result: boolean | undefined;
      executeGuard().subscribe((value: boolean) => {
        result = value;
      });
      tick();

      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    }));
  });

  describe('en cas d\'erreur API', () => {
    it('devrait refuser l\'accès et rediriger vers /home', fakeAsync(() => {
      lootServiceMock.apiService.request.and.returnValue(
        throwError(() => new Error('API Error'))
      );

      let result: boolean | undefined;
      executeGuard().subscribe((value: boolean) => {
        result = value;
      });
      tick();

      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    }));

    it('devrait gérer les erreurs HTTP 500', fakeAsync(() => {
      lootServiceMock.apiService.request.and.returnValue(
        throwError(() => ({ status: 500, message: 'Internal Server Error' }))
      );

      let result: boolean | undefined;
      executeGuard().subscribe((value: boolean) => {
        result = value;
      });
      tick();

      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    }));

    it('devrait gérer les erreurs HTTP 401', fakeAsync(() => {
      lootServiceMock.apiService.request.and.returnValue(
        throwError(() => ({ status: 401, message: 'Unauthorized' }))
      );

      let result: boolean | undefined;
      executeGuard().subscribe((value: boolean) => {
        result = value;
      });
      tick();

      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    }));
  });

  describe('appel API', () => {
    it('devrait appeler l\'endpoint correct', fakeAsync(() => {
      lootServiceMock.apiService.request.and.returnValue(of({ available: true }));

      executeGuard().subscribe();
      tick();

      expect(lootServiceMock.apiService.request).toHaveBeenCalledWith(
        'GET',
        '/me/loot/availability'
      );
    }));

    it('devrait prendre uniquement la première valeur (take(1))', fakeAsync(() => {
      lootServiceMock.apiService.request.and.returnValue(of({ available: true }));

      let emissionCount = 0;
      executeGuard().subscribe(() => {
        emissionCount++;
      });
      tick();

      expect(emissionCount).toBe(1);
    }));
  });
});
