import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { EditBgComponent } from './edit-bg.component';
import { ApiService } from '../../services/api.service';
import { AssetsService } from '../../services/assets.service';
import { createMockAssetsService } from '../../testing/test-helpers';

describe('EditBgComponent', () => {
  let component: EditBgComponent;
  let fixture: ComponentFixture<EditBgComponent>;
  let apiServiceMock: any;

  beforeEach(async () => {
    apiServiceMock = {
      request: jasmine.createSpy('request').and.returnValue(of(['bg1.jpg', 'bg2.jpg']))
    };

    await TestBed.configureTestingModule({
      declarations: [EditBgComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: AssetsService, useValue: createMockAssetsService() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EditBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load backgrounds on init', () => {
    expect(apiServiceMock.request).toHaveBeenCalledWith('GET', '/mmii/parts/backgrounds');
    expect(component.backgrounds.length).toBe(2);
  });

  it('should emit backgroundChange when changeBg is called', () => {
    spyOn(component.backgroundChange, 'emit');
    component.changeBg('newBg.jpg');
    expect(component.backgroundChange.emit).toHaveBeenCalledWith('newBg.jpg');
  });
});
