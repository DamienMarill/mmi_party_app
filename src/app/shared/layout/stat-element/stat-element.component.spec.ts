import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StatElementComponent } from './stat-element.component';

describe('StatElementComponent', () => {
  let component: StatElementComponent;
  let fixture: ComponentFixture<StatElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatElementComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(StatElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty statElement by default', () => {
    expect(component.statElement).toBe('');
  });

  it('should have fa icons defined', () => {
    expect(component.fa).toBeDefined();
    expect(component.fa.audiovisuel).toBeDefined();
    expect(component.fa.communication).toBeDefined();
    expect(component.fa.dev).toBeDefined();
    expect(component.fa.graphisme).toBeDefined();
    expect(component.fa.trois_d).toBeDefined();
    expect(component.fa.ux_ui).toBeDefined();
  });
});
