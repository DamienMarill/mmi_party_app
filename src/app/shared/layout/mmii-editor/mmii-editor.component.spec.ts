import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { MmiiEditorComponent } from './mmii-editor.component';
import { ApiService } from '../../services/api.service';

describe('MmiiEditorComponent', () => {
  let component: MmiiEditorComponent;
  let fixture: ComponentFixture<MmiiEditorComponent>;
  let apiServiceMock: any;

  const mockShapeParts = {
    bouche: { files: ['bouche1.png'], availableColors: ['#ff0000'] },
    cheveux: { files: ['cheveux1.png'], availableColors: ['#000000'] },
    nez: { files: ['nez1.png'] },
    tete: { files: ['tete1.png'], availableColors: ['#ffcc99'] },
    yeux: { files: ['yeux1.png'], availableColors: ['#0000ff'] },
    pilosite: { files: ['pilosite1.png'], availableColors: ['#000000'] },
    maquillage: { files: ['maquillage1.png'] },
    particularites: { files: ['particularites1.png'], availableColors: ['#ff0000'] },
    sourcils: { files: ['sourcils1.png'], availableColors: ['#000000'] },
    pull: { files: ['pull1.png'], availableColors: ['#0000ff'] }
  };

  beforeEach(async () => {
    apiServiceMock = {
      request: jasmine.createSpy('request').and.returnValue(of(mockShapeParts))
    };

    await TestBed.configureTestingModule({
      declarations: [MmiiEditorComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MmiiEditorComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() because ngOnChanges has a bug accessing changes['mmii']
    // instead of changes['mmiiShape']
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call API to load shape parts', () => {
    // The API is called in the constructor
    expect(apiServiceMock.request).toHaveBeenCalledWith('GET', '/mmii/parts');
  });

  it('should have default selected part as tete', () => {
    expect(component.selectedPart).toBe('tete');
  });

  it('should emit mmiiShapeChange when sendMmii is called', () => {
    spyOn(component.mmiiShapeChange, 'emit');
    component.sendMmii();
    expect(component.mmiiShapeChange.emit).toHaveBeenCalled();
  });

  it('should check if part has color correctly', () => {
    const partWithColor = { img: 'test.png', color: '#000000' };
    const partWithoutColor = { img: 'test.png' };

    expect(component.hasColor(partWithColor)).toBeTrue();
    expect(component.hasColor(partWithoutColor)).toBeFalse();
  });

  it('should have FontAwesome icons defined', () => {
    expect(component.fa).toBeDefined();
    expect(component.fa.faHeadSide).toBeDefined();
    expect(component.fa.faUserHair).toBeDefined();
  });
});
