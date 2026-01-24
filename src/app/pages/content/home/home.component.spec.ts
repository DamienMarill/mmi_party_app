import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { HomeComponent } from './home.component';
import { ApiService } from '../../../shared/services/api.service';
import { AssetsService } from '../../../shared/services/assets.service';
import { LootService } from '../../../shared/services/loot.service';
import {
  createMockApiService,
  createMockAssetsService,
  createMockLootService
} from '../../../shared/testing/test-helpers';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: ApiService, useValue: createMockApiService() },
        { provide: AssetsService, useValue: createMockAssetsService() },
        { provide: LootService, useValue: createMockLootService() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have user set from apiService after init', () => {
    expect(component.user).toBeDefined();
  });
});
