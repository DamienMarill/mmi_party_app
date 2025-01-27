import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MmiiComponent } from './mmii.component';

describe('MmiiComponent', () => {
  let component: MmiiComponent;
  let fixture: ComponentFixture<MmiiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MmiiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MmiiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
