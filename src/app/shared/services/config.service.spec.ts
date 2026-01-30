import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { environment } from '../../../environments/environment';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigService]
    });
    service = TestBed.inject(ConfigService);
  });

  describe('création', () => {
    it('devrait être créé', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getApiUrl()', () => {
    it('devrait retourner l\'URL de l\'API depuis l\'environnement', () => {
      const apiUrl = service.getApiUrl();
      expect(apiUrl).toBe(environment.api);
    });

    it('devrait retourner une string non vide', () => {
      const apiUrl = service.getApiUrl();
      expect(apiUrl).toBeTruthy();
      expect(typeof apiUrl).toBe('string');
      expect(apiUrl.length).toBeGreaterThan(0);
    });

    it('devrait retourner une URL valide', () => {
      const apiUrl = service.getApiUrl();
      expect(apiUrl).toMatch(/^https?:\/\/.+/);
    });
  });
});
