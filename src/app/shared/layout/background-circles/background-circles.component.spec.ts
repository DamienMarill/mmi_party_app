import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

import { BackgroundCirclesComponent } from './background-circles.component';
import { CicleService } from '../../services/cicle.service';
import { createMockCicleService } from '../../testing/test-helpers';

describe('BackgroundCirclesComponent', () => {
  let component: BackgroundCirclesComponent;
  let fixture: ComponentFixture<BackgroundCirclesComponent>;
  let cicleServiceMock: any;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    routerEventsSubject = new Subject();
    cicleServiceMock = createMockCicleService();

    await TestBed.configureTestingModule({
      declarations: [BackgroundCirclesComponent],
      providers: [
        { provide: CicleService, useValue: cicleServiceMock },
        {
          provide: Router,
          useValue: {
            events: routerEventsSubject.asObservable()
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BackgroundCirclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have circle1$ observable', () => {
    expect(component.circle1$).toBeDefined();
  });

  it('should have circle2$ observable', () => {
    expect(component.circle2$).toBeDefined();
  });

  it('should update circles on navigation', () => {
    const navigationEnd = new NavigationEnd(1, '/home', '/home');
    routerEventsSubject.next(navigationEnd);

    expect(cicleServiceMock.updateCircles).toHaveBeenCalled();
  });
});
