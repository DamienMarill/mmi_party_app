import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundCirclesComponent } from './background-circles.component';

describe('BackgroundCirclesComponent', () => {
  let component: BackgroundCirclesComponent;
  let fixture: ComponentFixture<BackgroundCirclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BackgroundCirclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundCirclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
