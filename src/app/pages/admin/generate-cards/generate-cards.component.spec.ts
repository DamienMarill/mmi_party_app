import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { GenerateCardsComponent } from './generate-cards.component';
import { ClipboardService } from '../../../shared/services/clipboard.service';
import { createMockClipboardService } from '../../../shared/testing/test-helpers';

describe('GenerateCardsComponent', () => {
  let component: GenerateCardsComponent;
  let fixture: ComponentFixture<GenerateCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateCardsComponent],
      providers: [
        { provide: ClipboardService, useValue: createMockClipboardService() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty name by default', () => {
    expect(component.name).toBe('');
  });

  it('should have empty background by default', () => {
    expect(component.background).toBe('');
  });
});
