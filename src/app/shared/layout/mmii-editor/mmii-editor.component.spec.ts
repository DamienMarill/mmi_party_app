import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MmiiEditorComponent } from './mmii-editor.component';

describe('MmiiEditorComponent', () => {
  let component: MmiiEditorComponent;
  let fixture: ComponentFixture<MmiiEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MmiiEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MmiiEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
