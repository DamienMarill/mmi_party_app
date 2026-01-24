import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [InputComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.placeholder).toBe('');
    expect(component.label).toBe('');
    expect(component.type).toBe('text');
    expect(component.required).toBeFalse();
  });

  it('should have unique id', () => {
    expect(component.id).toMatch(/^mll-input-/);
  });

  it('should write value correctly', () => {
    component.writeValue('test value');
    expect(component.value).toBe('test value');
  });

  it('should register onChange callback', () => {
    const mockFn = jasmine.createSpy('onChange');
    component.registerOnChange(mockFn);
    component.onInput('new value');
    expect(mockFn).toHaveBeenCalledWith('new value');
  });

  it('should handle checkbox type correctly', () => {
    component.type = 'toggle';
    expect(component.checkboxTypeSanityse()).toBe('checkbox');
  });

  it('should detect required from control validator', () => {
    const control = new FormControl('', Validators.required);
    component.validate(control);
    expect(component.isRequired).toBeTrue();
  });
});
