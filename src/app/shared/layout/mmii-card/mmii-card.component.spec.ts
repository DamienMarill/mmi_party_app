import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MmiiCardComponent } from './mmii-card.component';
import { AssetsService } from '../../services/assets.service';
import { createMockAssetsService } from '../../testing/test-helpers';

describe('MmiiCardComponent', () => {
  let component: MmiiCardComponent;
  let fixture: ComponentFixture<MmiiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MmiiCardComponent],
      providers: [
        { provide: AssetsService, useValue: createMockAssetsService() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MmiiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have undefined cardVersion by default', () => {
    expect(component.cardVersion).toBeUndefined();
  });

  it('should have undefined count by default', () => {
    expect(component.count).toBeUndefined();
  });
});
