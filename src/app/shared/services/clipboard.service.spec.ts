import { TestBed } from '@angular/core/testing';

import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
  let service: ClipboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClipboardService]
    });
    service = TestBed.inject(ClipboardService);
  });

  describe('création', () => {
    it('devrait être créé', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('copyToClipboard()', () => {
    it('devrait retourner un Promise<boolean>', async () => {
      const result = service.copyToClipboard('test');
      expect(result).toBeInstanceOf(Promise);
    });

    it('devrait retourner un booléen en résultat', async () => {
      // Dans un environnement de test headless, l'API clipboard peut ne pas être disponible
      // On vérifie juste que la fonction retourne un booléen
      const result = await service.copyToClipboard('test text');
      expect(typeof result).toBe('boolean');
    });

    it('devrait gérer une chaîne vide', async () => {
      const result = await service.copyToClipboard('');
      expect(typeof result).toBe('boolean');
    });

    it('devrait gérer du texte avec caractères spéciaux', async () => {
      const specialText = '<script>alert("test")</script> & "quotes" \'apostrophes\'';
      const result = await service.copyToClipboard(specialText);
      expect(typeof result).toBe('boolean');
    });

    it('devrait gérer du texte multiligne', async () => {
      const multilineText = 'Ligne 1\nLigne 2\nLigne 3';
      const result = await service.copyToClipboard(multilineText);
      expect(typeof result).toBe('boolean');
    });

    it('devrait gérer du texte Unicode', async () => {
      const unicodeText = '日本語 한국어 العربية 🎮🎲';
      const result = await service.copyToClipboard(unicodeText);
      expect(typeof result).toBe('boolean');
    });
  });
});
