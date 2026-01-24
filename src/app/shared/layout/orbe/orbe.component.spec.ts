import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { OrbeComponent } from './orbe.component';
import { Rarity } from '../../interfaces/card-version';

describe('OrbeComponent', () => {
  let component: OrbeComponent;
  let fixture: ComponentFixture<OrbeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrbeComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OrbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have undefined rarity by default', () => {
    expect(component.rarity).toBeUndefined();
  });

  it('should have show as true by default', () => {
    expect(component.show).toBeTrue();
  });

  it('should return correct rarity index', () => {
    expect(component.getRarityIndex(Rarity.Rare)).toBe(1);
    expect(component.getRarityIndex(Rarity.Common)).toBe(2);
    expect(component.getRarityIndex(Rarity.Uncommon)).toBe(3);
    expect(component.getRarityIndex(Rarity.Epic)).toBe(4);
  });
});
