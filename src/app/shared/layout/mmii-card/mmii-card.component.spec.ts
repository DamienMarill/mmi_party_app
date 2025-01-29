import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MmiiCardComponent } from './mmii-card.component';

describe('MmiiCardComponent', () => {
  let component: MmiiCardComponent;
  let fixture: ComponentFixture<MmiiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MmiiCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MmiiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
