import { TestBed } from '@angular/core/testing';

import { AssetsService } from './assets.service';
import { environment } from '../../../environments/environment';

describe('AssetsService', () => {
  let service: AssetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssetsService]
    });
    service = TestBed.inject(AssetsService);
  });

  describe('création', () => {
    it('devrait être créé', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getBgUrl()', () => {
    it('devrait retourner l\'URL complète du background', () => {
      const path = 'forest.jpg';
      const url = service.getBgUrl(path);
      expect(url).toBe(`${environment.storage}/background/${path}`);
    });

    it('devrait gérer un path undefined', () => {
      const url = service.getBgUrl(undefined);
      expect(url).toBe(`${environment.storage}/background/undefined`);
    });

    it('devrait gérer un path vide', () => {
      const url = service.getBgUrl('');
      expect(url).toBe(`${environment.storage}/background/`);
    });

    it('devrait inclure le chemin complet avec sous-dossiers', () => {
      const path = 'themes/dark/bg1.png';
      const url = service.getBgUrl(path);
      expect(url).toBe(`${environment.storage}/background/${path}`);
    });
  });

  describe('getCardImgUrl()', () => {
    it('devrait retourner l\'URL complète de l\'image de carte', () => {
      const path = 'card_001.png';
      const url = service.getCardImgUrl(path);
      expect(url).toBe(`${environment.storage}/card_image/${path}`);
    });

    it('devrait gérer un path undefined', () => {
      const url = service.getCardImgUrl(undefined);
      expect(url).toBe(`${environment.storage}/card_image/undefined`);
    });

    it('devrait gérer un path vide', () => {
      const url = service.getCardImgUrl('');
      expect(url).toBe(`${environment.storage}/card_image/`);
    });

    it('devrait inclure le chemin complet avec sous-dossiers', () => {
      const path = 'rare/dragon.png';
      const url = service.getCardImgUrl(path);
      expect(url).toBe(`${environment.storage}/card_image/${path}`);
    });
  });

  describe('getCardTemplateUrl()', () => {
    it('devrait retourner l\'URL complète du template fullart', () => {
      const path = 'template_epic.png';
      const url = service.getCardTemplateUrl(path);
      expect(url).toBe(`${environment.storage}/fullart/${path}`);
    });

    it('devrait gérer un path undefined', () => {
      const url = service.getCardTemplateUrl(undefined);
      expect(url).toBe(`${environment.storage}/fullart/undefined`);
    });

    it('devrait gérer un path vide', () => {
      const url = service.getCardTemplateUrl('');
      expect(url).toBe(`${environment.storage}/fullart/`);
    });

    it('devrait inclure le chemin complet avec sous-dossiers', () => {
      const path = 'v2/legendary/frame.png';
      const url = service.getCardTemplateUrl(path);
      expect(url).toBe(`${environment.storage}/fullart/${path}`);
    });
  });

  describe('cohérence des URLs', () => {
    it('toutes les URLs devraient utiliser le même storage base', () => {
      const bgUrl = service.getBgUrl('test');
      const cardUrl = service.getCardImgUrl('test');
      const templateUrl = service.getCardTemplateUrl('test');

      const storageBase = environment.storage;
      expect(bgUrl).toContain(storageBase);
      expect(cardUrl).toContain(storageBase);
      expect(templateUrl).toContain(storageBase);
    });

    it('les URLs devraient avoir des chemins distincts', () => {
      const bgUrl = service.getBgUrl('test');
      const cardUrl = service.getCardImgUrl('test');
      const templateUrl = service.getCardTemplateUrl('test');

      expect(bgUrl).toContain('/background/');
      expect(cardUrl).toContain('/card_image/');
      expect(templateUrl).toContain('/fullart/');
    });
  });
});
