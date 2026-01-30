import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TetrisComponent } from './tetris.component';

describe('TetrisComponent', () => {
  let component: TetrisComponent;
  let fixture: ComponentFixture<TetrisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TetrisComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TetrisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default size', () => {
    expect(component.size).toBe('1.5rem');
  });

  it('should have empty shape by default', () => {
    expect(component.shape).toEqual([]);
  });

  it('should accept custom size', () => {
    component.size = '2rem';
    expect(component.size).toBe('2rem');
  });

  it('should accept custom shape', () => {
    const customShape = [[true, false], [false, true]];
    component.shape = customShape;
    expect(component.shape).toEqual(customShape);
  });
});
