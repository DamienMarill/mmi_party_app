import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatElementComponent } from './stat-element.component';

describe('StatElementComponent', () => {
  let component: StatElementComponent;
  let fixture: ComponentFixture<StatElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
