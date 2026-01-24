import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CardComponent } from './card.component';
import { ApiService } from '../../../shared/services/api.service';
import { AssetsService } from '../../../shared/services/assets.service';
import {
  createMockApiService,
  createMockAssetsService,
  createMockActivatedRoute
} from '../../../shared/testing/test-helpers';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardComponent],
      providers: [
        { provide: ApiService, useValue: createMockApiService() },
        { provide: AssetsService, useValue: createMockAssetsService() },
        { provide: ActivatedRoute, useValue: createMockActivatedRoute({ cardId: '123' }) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have fa icons defined', () => {
    expect(component.fa).toBeDefined();
  });
});
