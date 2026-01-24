import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CollectionComponent } from './collection.component';
import { ApiService } from '../../../shared/services/api.service';
import { createMockApiService } from '../../../shared/testing/test-helpers';

describe('CollectionComponent', () => {
  let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionComponent],
      providers: [
        { provide: ApiService, useValue: createMockApiService() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty cards array', () => {
    expect(component.cards).toBeDefined();
    expect(Array.isArray(component.cards)).toBeTrue();
  });
});
