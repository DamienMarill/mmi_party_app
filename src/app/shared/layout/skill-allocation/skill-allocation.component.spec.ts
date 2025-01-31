import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillAllocationComponent } from './skill-allocation.component';

describe('SkillAllocationComponent', () => {
  let component: SkillAllocationComponent;
  let fixture: ComponentFixture<SkillAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillAllocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
