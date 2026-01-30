import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { LootService } from './loot.service';
import { ApiService } from './api.service';

describe('LootService', () => {
  let service: LootService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['request']);
    // Default mock response
    apiServiceSpy.request.and.returnValue(of({
      available: false,
      nextAvailableTime: '12:00'
    }));

    TestBed.configureTestingModule({
      providers: [
        LootService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(LootService);
  });

  describe('création', () => {
    it('devrait être créé', () => {
      expect(service).toBeTruthy();
    });

    it('devrait appeler updateLootAvailability au démarrage', () => {
      expect(apiServiceSpy.request).toHaveBeenCalledWith('GET', '/me/loot/availability');
    });
  });

  describe('isLootAvailable', () => {
    it('devrait retourner false par défaut', () => {
      expect(service.isLootAvailable).toBeFalse();
    });

    it('devrait retourner true quand le loot est disponible', fakeAsync(() => {
      apiServiceSpy.request.and.returnValue(of({
        available: true,
        nextAvailableTime: '12:00'
      }));

      service.updateLootAvailability();
      tick();

      expect(service.isLootAvailable).toBeTrue();
    }));

    it('devrait retourner false quand le loot n\'est pas disponible', fakeAsync(() => {
      apiServiceSpy.request.and.returnValue(of({
        available: false,
        nextAvailableTime: '18:00'
      }));

      service.updateLootAvailability();
      tick();

      expect(service.isLootAvailable).toBeFalse();
    }));
  });

  describe('nextLootTime', () => {
    it('devrait calculer la prochaine heure de loot pour aujourd\'hui', fakeAsync(() => {
      // Utilise une heure future pour s'assurer que c'est aujourd'hui
      const futureHour = new Date().getHours() + 2;
      const timeString = `${futureHour.toString().padStart(2, '0')}:30`;

      apiServiceSpy.request.and.returnValue(of({
        available: false,
        nextAvailableTime: timeString
      }));

      service.updateLootAvailability();
      tick();

      const nextLoot = service.nextLootTime;
      expect(nextLoot).toBeDefined();
      expect(nextLoot.getHours()).toBe(futureHour);
      expect(nextLoot.getMinutes()).toBe(30);
    }));

    it('devrait passer au lendemain si l\'heure est passée', fakeAsync(() => {
      // Utilise une heure passée
      const pastHour = new Date().getHours() - 2;
      const timeString = `${Math.max(0, pastHour).toString().padStart(2, '0')}:00`;

      // Créer une nouvelle instance avec l'heure passée
      apiServiceSpy.request.and.returnValue(of({
        available: false,
        nextAvailableTime: timeString
      }));

      service.updateLootAvailability();
      tick();

      const nextLoot = service.nextLootTime;
      const today = new Date();

      // Si l'heure est passée, devrait être demain
      if (pastHour >= 0 && pastHour < today.getHours()) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        expect(nextLoot.getDate()).toBe(tomorrow.getDate());
      }
    }));
  });

  describe('updateLootAvailability()', () => {
    it('devrait faire une requête GET à /me/loot/availability', fakeAsync(() => {
      apiServiceSpy.request.calls.reset();

      service.updateLootAvailability();
      tick();

      expect(apiServiceSpy.request).toHaveBeenCalledWith('GET', '/me/loot/availability');
    }));

    it('devrait mettre à jour isLootAvailable depuis la réponse', fakeAsync(() => {
      apiServiceSpy.request.and.returnValue(of({
        available: true,
        nextAvailableTime: '10:00'
      }));

      service.updateLootAvailability();
      tick();

      expect(service.isLootAvailable).toBeTrue();
    }));

    it('devrait mettre à jour nextLootTime depuis la réponse', fakeAsync(() => {
      apiServiceSpy.request.and.returnValue(of({
        available: false,
        nextAvailableTime: '14:45'
      }));

      service.updateLootAvailability();
      tick();

      const nextLoot = service.nextLootTime;
      expect(nextLoot.getMinutes()).toBe(45);
    }));
  });

  describe('apiService', () => {
    it('devrait exposer apiService publiquement', () => {
      expect(service.apiService).toBeDefined();
      expect(service.apiService).toBe(apiServiceSpy);
    });
  });
});
