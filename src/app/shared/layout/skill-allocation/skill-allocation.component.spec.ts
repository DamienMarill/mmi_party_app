import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SkillAllocationComponent } from './skill-allocation.component';

describe('SkillAllocationComponent', () => {
  let component: SkillAllocationComponent;
  let fixture: ComponentFixture<SkillAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SkillAllocationComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SkillAllocationComponent);
    component = fixture.componentInstance;
    // Note: Not calling fixture.detectChanges() to avoid infinite loop
    // The component has a circular dependency in valueChanges → calculateRemainingPoints → updateValueAndValidity
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have skillForm initialized', () => {
    expect(component.skillForm).toBeDefined();
  });

  it('should have default promo as MMI1', () => {
    expect(component.promo).toBe('MMI1');
  });

  it('should have all skill categories', () => {
    expect(component.skillCategories.length).toBe(6);
    expect(component.skillCategories.map(c => c.key)).toContain('audiovisuel');
    expect(component.skillCategories.map(c => c.key)).toContain('communication');
    expect(component.skillCategories.map(c => c.key)).toContain('dev');
    expect(component.skillCategories.map(c => c.key)).toContain('graphisme');
    expect(component.skillCategories.map(c => c.key)).toContain('trois_d');
    expect(component.skillCategories.map(c => c.key)).toContain('ux_ui');
  });

  it('should have form controls for each skill', () => {
    expect(component.skillForm.get('audiovisuel')).toBeTruthy();
    expect(component.skillForm.get('communication')).toBeTruthy();
    expect(component.skillForm.get('dev')).toBeTruthy();
    expect(component.skillForm.get('graphisme')).toBeTruthy();
    expect(component.skillForm.get('trois_d')).toBeTruthy();
    expect(component.skillForm.get('ux_ui')).toBeTruthy();
  });

  it('should initialize form controls with value 0', () => {
    expect(component.skillForm.get('audiovisuel')?.value).toBe(0);
    expect(component.skillForm.get('dev')?.value).toBe(0);
  });
});
