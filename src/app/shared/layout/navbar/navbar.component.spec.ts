import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { NavbarComponent } from './navbar.component';
import { createMockRouter, createMockActivatedRoute } from '../../testing/test-helpers';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [NavbarComponent],
      providers: [
        { provide: Router, useValue: createMockRouter() },
        { provide: ActivatedRoute, useValue: createMockActivatedRoute() },
        { provide: Location, useValue: { back: jasmine.createSpy('back'), getState: () => ({ navigationId: 1 }), replaceState: jasmine.createSpy('replaceState') } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default navConfig', () => {
    expect(component.navConfig).toBeDefined();
    expect(component.navConfig.showNav).toBeTrue();
    expect(component.navConfig.showBack).toBeFalse();
  });
});
