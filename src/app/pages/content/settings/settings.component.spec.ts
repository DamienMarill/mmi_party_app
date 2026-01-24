import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { SettingsComponent } from './settings.component';
import { ApiService } from '../../../shared/services/api.service';
import { createMockApiService } from '../../../shared/testing/test-helpers';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let apiServiceMock: any;

  beforeEach(async () => {
    apiServiceMock = createMockApiService();

    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have undefined mmiiShape by default', () => {
    // The mock user doesn't have mmii property, so mmiiShape is undefined
    expect(component.mmiiShape).toBeUndefined();
  });

  it('should change background', () => {
    component.changeBackground('new-bg.jpg');
    expect(component.background).toBe('new-bg.jpg');
  });

  it('should change mmii shape', () => {
    const mockShape = { tete: { img: 'test.png', color: '#fff' } } as any;
    apiServiceMock.request.and.returnValue(of({}));

    component.changeMMiiShape(mockShape);

    expect(component.mmiiShape).toEqual(mockShape);
    expect(apiServiceMock.request).toHaveBeenCalledWith('PUT', '/mmii/parts', jasmine.any(Object));
  });
});
