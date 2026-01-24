import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { LootComponent } from './loot.component';
import { ApiService } from '../../../shared/services/api.service';
import { ConfettiService } from '../../../shared/services/confetti.service';
import { LootService } from '../../../shared/services/loot.service';
import {
  createMockRouter,
  createMockConfettiService,
  createMockLootService
} from '../../../shared/testing/test-helpers';

describe('LootComponent', () => {
  let component: LootComponent;
  let fixture: ComponentFixture<LootComponent>;
  let apiServiceMock: any;

  const mockLootbox = {
    cards: [
      { card_version: { rarity: 'common' } },
      { card_version: { rarity: 'rare' } }
    ]
  };

  beforeEach(async () => {
    apiServiceMock = {
      request: jasmine.createSpy('request').and.returnValue(of(mockLootbox))
    };

    await TestBed.configureTestingModule({
      declarations: [LootComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: createMockRouter() },
        { provide: ConfettiService, useValue: createMockConfettiService() },
        { provide: LootService, useValue: createMockLootService() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load lootbox on init', () => {
    expect(apiServiceMock.request).toHaveBeenCalledWith('GET', '/me/loot');
    expect(component.lootbox).toBeDefined();
  });

  it('should initialize showOrbe array based on cards count', () => {
    expect(component.showOrbe.length).toBe(mockLootbox.cards.length);
  });

  it('should calculate position correctly', () => {
    const position = component.getPosition(0);
    expect(position.left).toBeDefined();
    expect(position.top).toBeDefined();
    expect(position.transform).toBeDefined();
  });
});
