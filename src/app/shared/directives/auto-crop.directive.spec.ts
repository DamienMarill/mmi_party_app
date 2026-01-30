import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AutoCropDirective } from './auto-crop.directive';

// Test host component - non standalone pour matcher avec la directive
@Component({
  selector: 'app-test-host',
  standalone: false,
  template: `<img appAutoCrop [padding]="padding" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" />`
})
class TestHostComponent {
  padding = 0;
}

describe('AutoCropDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let imgElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutoCropDirective, TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
    imgElement = fixture.debugElement.query(By.directive(AutoCropDirective));
  });

  describe('création', () => {
    it('devrait créer une instance de la directive', () => {
      const directive = imgElement.injector.get(AutoCropDirective);
      expect(directive).toBeTruthy();
    });

    it('devrait être attachée à l\'élément img', () => {
      expect(imgElement).toBeTruthy();
      expect(imgElement.nativeElement.tagName.toLowerCase()).toBe('img');
    });
  });

  describe('padding input', () => {
    it('devrait avoir un padding par défaut de 0', () => {
      const directive = imgElement.injector.get(AutoCropDirective);
      expect(directive.padding).toBe(0);
    });

    it('devrait accepter une valeur de padding personnalisée', () => {
      hostComponent.padding = 10;
      fixture.detectChanges();
      const directive = imgElement.injector.get(AutoCropDirective);
      expect(directive.padding).toBe(10);
    });
  });

  describe('ngAfterViewInit', () => {
    it('devrait être appelé après l\'initialisation de la vue', fakeAsync(() => {
      const directive = imgElement.injector.get(AutoCropDirective);
      const spy = spyOn<any>(directive, 'cropTransparentBorders');

      // Forcer la réinitialisation
      directive.ngAfterViewInit();
      tick(500);

      expect(spy).toHaveBeenCalled();
    }));

    it('devrait attendre 500ms avant de traiter l\'image', fakeAsync(() => {
      const directive = imgElement.injector.get(AutoCropDirective);
      const spy = spyOn<any>(directive, 'cropTransparentBorders');

      directive.ngAfterViewInit();

      // Avant 500ms
      tick(400);
      expect(spy).not.toHaveBeenCalled();

      // Après 500ms
      tick(100);
      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('getBounds (via test indirect)', () => {
    it('devrait gérer une image valide sans erreur', fakeAsync(() => {
      // Ce test vérifie que la directive ne génère pas d'erreur
      // lors du traitement d'une image
      expect(() => {
        fixture.detectChanges();
        tick(600);
      }).not.toThrow();
    }));
  });
});
