import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBgComponent } from './edit-bg.component';

describe('EditBgComponent', () => {
  let component: EditBgComponent;
  let fixture: ComponentFixture<EditBgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditBgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
