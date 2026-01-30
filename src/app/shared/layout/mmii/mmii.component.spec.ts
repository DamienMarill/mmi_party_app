import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MmiiComponent } from './mmii.component';

describe('MmiiComponent', () => {
  let component: MmiiComponent;
  let fixture: ComponentFixture<MmiiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MmiiComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MmiiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default size', () => {
    expect(component.size).toBe('20rem');
  });

  it('should have undefined mmiiShapes by default', () => {
    expect(component.mmiiShapes).toBeUndefined();
  });

  it('should convert hex to HSL correctly', () => {
    const hsl = component.hexToHSL('#ff0000');
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it('should calculate brightness from hex color', () => {
    const brightness = component.getBrightness('#ffffff');
    expect(brightness).toBe(100);
  });
});
