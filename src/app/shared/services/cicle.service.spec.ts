import { TestBed } from '@angular/core/testing';

import { CicleService } from './cicle.service';

describe('CicleService', () => {
  let service: CicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have circle1$ observable', () => {
    expect(service.circle1$).toBeDefined();
  });

  it('should have circle2$ observable', () => {
    expect(service.circle2$).toBeDefined();
  });

  it('should emit circle data with color and position', (done) => {
    service.circle1$.subscribe((circle) => {
      expect(circle.color).toBeDefined();
      expect(circle.position).toBeDefined();
      expect(circle.position.x).toBeGreaterThanOrEqual(0);
      expect(circle.position.x).toBeLessThanOrEqual(100);
      expect(circle.position.y).toBeGreaterThanOrEqual(0);
      expect(circle.position.y).toBeLessThanOrEqual(100);
      done();
    });
  });

  it('should update circles when updateCircles is called', (done) => {
    let emitCount = 0;
    let previousCircle: any;

    service.circle1$.subscribe((circle) => {
      emitCount++;
      if (emitCount === 1) {
        previousCircle = circle;
        service.updateCircles();
      } else if (emitCount === 2) {
        // Circles updated, new values emitted
        expect(circle).toBeDefined();
        done();
      }
    });
  });

  it('should have valid color classes', (done) => {
    const validColors = [
      'bg-rarity-common',
      'bg-rarity-uncommon',
      'bg-rarity-rare',
      'bg-rarity-epic'
    ];

    service.circle1$.subscribe((circle) => {
      expect(validColors).toContain(circle.color);
      done();
    });
  });
});
