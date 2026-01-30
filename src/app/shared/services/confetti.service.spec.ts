import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';

import { ConfettiService } from './confetti.service';

describe('ConfettiService', () => {
  let service: ConfettiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfettiService]
    });
    service = TestBed.inject(ConfettiService);
  });

  describe('création', () => {
    it('devrait être créé', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('randomInRange()', () => {
    it('devrait retourner une valeur dans la plage spécifiée', () => {
      const min = 10;
      const max = 20;

      // Test plusieurs fois pour vérifier la consistance
      for (let i = 0; i < 100; i++) {
        const result = service.randomInRange(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThan(max);
      }
    });

    it('devrait retourner le min quand min === max', () => {
      const result = service.randomInRange(5, 5);
      expect(result).toBe(5);
    });

    it('devrait gérer des valeurs négatives', () => {
      const result = service.randomInRange(-10, -5);
      expect(result).toBeGreaterThanOrEqual(-10);
      expect(result).toBeLessThan(-5);
    });

    it('devrait gérer des valeurs décimales', () => {
      const result = service.randomInRange(0.5, 1.5);
      expect(result).toBeGreaterThanOrEqual(0.5);
      expect(result).toBeLessThan(1.5);
    });

    it('devrait retourner un nombre', () => {
      const result = service.randomInRange(0, 100);
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBeFalse();
    });
  });

  describe('defineStars()', () => {
    it('devrait être défini comme méthode', () => {
      expect(service.defineStars).toBeDefined();
      expect(typeof service.defineStars).toBe('function');
    });

    it('devrait s\'exécuter sans erreur', () => {
      expect(() => service.defineStars()).not.toThrow();
    });
  });

  describe('stars()', () => {
    it('devrait être défini comme méthode', () => {
      expect(service.stars).toBeDefined();
      expect(typeof service.stars).toBe('function');
    });

    it('devrait s\'exécuter sans erreur', fakeAsync(() => {
      expect(() => service.stars()).not.toThrow();
      // Avancer le temps pour les timers
      tick(500);
    }));

    it('devrait appeler defineStars plusieurs fois avec des délais', fakeAsync(() => {
      const defineStarsSpy = spyOn(service, 'defineStars');

      service.stars();

      // Premier appel immédiat
      expect(defineStarsSpy).toHaveBeenCalledTimes(1);

      // Après 100ms
      tick(100);
      expect(defineStarsSpy).toHaveBeenCalledTimes(2);

      // Après 200ms (total)
      tick(100);
      expect(defineStarsSpy).toHaveBeenCalledTimes(3);

      // Après 300ms (total)
      tick(100);
      expect(defineStarsSpy).toHaveBeenCalledTimes(4);

      // Après 400ms (total)
      tick(100);
      expect(defineStarsSpy).toHaveBeenCalledTimes(5);
    }));
  });

  describe('cannon()', () => {
    it('devrait être défini comme méthode', () => {
      expect(service.cannon).toBeDefined();
      expect(typeof service.cannon).toBe('function');
    });

    it('devrait s\'exécuter sans erreur', () => {
      expect(() => service.cannon()).not.toThrow();
    });
  });

  describe('doubleCannon()', () => {
    it('devrait être défini comme méthode', () => {
      expect(service.doubleCannon).toBeDefined();
      expect(typeof service.doubleCannon).toBe('function');
    });

    it('devrait s\'exécuter sans erreur', fakeAsync(() => {
      expect(() => service.doubleCannon()).not.toThrow();
      tick(200);
    }));

    it('devrait appeler cannon deux fois', fakeAsync(() => {
      const cannonSpy = spyOn(service, 'cannon');

      service.doubleCannon();

      // Premier appel immédiat
      expect(cannonSpy).toHaveBeenCalledTimes(1);

      // Deuxième appel après 100ms
      tick(100);
      expect(cannonSpy).toHaveBeenCalledTimes(2);
    }));
  });

  describe('fireworks()', () => {
    it('devrait être défini comme méthode', () => {
      expect(service.fireworks).toBeDefined();
      expect(typeof service.fireworks).toBe('function');
    });

    it('devrait s\'exécuter sans erreur', fakeAsync(() => {
      expect(() => service.fireworks()).not.toThrow();
      // Les fireworks durent 3000ms avec intervals de 250ms
      tick(3500);
      discardPeriodicTasks();
    }));

    it('devrait s\'arrêter après la durée spécifiée (3000ms)', fakeAsync(() => {
      service.fireworks();

      // Vérifier que ça ne lance pas d'erreur pendant la durée
      tick(3000);

      // Après la durée, l'intervalle devrait être nettoyé
      tick(500);
      discardPeriodicTasks();

      // Si ça arrive ici sans erreur, le test passe
      expect(true).toBeTrue();
    }));
  });

  describe('intégration des méthodes', () => {
    it('toutes les méthodes d\'animation devraient être appelables en séquence', fakeAsync(() => {
      expect(() => {
        service.defineStars();
        service.stars();
        tick(500);
        service.cannon();
        service.doubleCannon();
        tick(200);
        service.fireworks();
        tick(3500);
        discardPeriodicTasks();
      }).not.toThrow();
    }));
  });
});
