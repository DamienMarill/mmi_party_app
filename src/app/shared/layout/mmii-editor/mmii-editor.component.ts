import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ApiService} from '../../services/api.service';
import { Mmii } from '../../interfaces/mmii';
import {BaseMMIIPart, ColoredMMIIPart, MmiiShape} from '../../interfaces/mmii-shape';
import {
  faHeadSide,
  faLips,
  faNose,
  faUserHair,
  faEye,
  faSparkles,
  faMustache,
  faGlasses
} from '@fortawesome/pro-solid-svg-icons';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-mmii-editor',
  standalone: false,

  templateUrl: './mmii-editor.component.html',
  styleUrl: './mmii-editor.component.scss'
})
export class MmiiEditorComponent implements OnChanges {
  shapeParts: any;
  selectedPart: keyof MmiiShape = 'tete';
  baseFolder = environment.storage + '/mmii';

  fa = {
    faHeadSide,
    faUserHair,
    faLips,
    faEye,
    faNose,
    faSparkles,
    faMustache,
    faGlasses
  }

  //input output mmii
  @Input()mmiiShape?: MmiiShape;
  @Output()mmiiShapeChange = new EventEmitter<MmiiShape>();

  constructor(
    private apiService: ApiService
  ) {
    this.apiService.request('GET', '/mmii/parts').subscribe(
      (response: any) => {
        console.log(response);
        this.shapeParts = response;
        if (!this.mmiiShape) {
          this.mmiiShape = this.defaultMmiiShape();
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mmii'].currentValue === undefined && this.shapeParts) {
      this.mmiiShape = this.defaultMmiiShape();
    }
  }

  sendMmii() {
    this.mmiiShapeChange.emit(this.mmiiShape);
  }

  defaultMmiiShape(): MmiiShape {
    return {
      bouche: {
        img: this.shapeParts.bouche.files[0],
        color: this.shapeParts.bouche.availableColors[0]
      },
      cheveux: {
        img: this.shapeParts.cheveux.files[0],
        color: this.shapeParts.cheveux.availableColors[0]
      },
      nez: {
        img: this.shapeParts.nez.files[0]
      },
      tete: {
        img: this.shapeParts.tete.files[0],
        color: this.shapeParts.tete.availableColors[0]
      },
      yeux: {
        img: this.shapeParts.yeux.files[0],
        color: this.shapeParts.yeux.availableColors[0]
      },
      pilosite: {
        img: this.shapeParts.pilosite.files[0],
        color: this.shapeParts.pilosite.availableColors[0]
      },
      maquillage: {
        img: this.shapeParts.maquillage.files[0]
      },
      particularites: {
        img: this.shapeParts.particularites.files[0]
      }
    };
  }

// Créer un type guard pour vérifier si une partie a une couleur
  hasColor(part: BaseMMIIPart | ColoredMMIIPart): part is ColoredMMIIPart {
    return 'color' in part;
  }

  updateColor(part: keyof MmiiShape, color: string) {
    if (this.mmiiShape && this.mmiiShape[part] && this.hasColor(this.mmiiShape[part])) {
      this.mmiiShape[part].color = color;
    }
  }

  updatePart(part: keyof MmiiShape, img: string) {
    if (this.mmiiShape && this.mmiiShape[part]) {
      this.mmiiShape[part].img = img;
    }
  }

  getCurrentColor(part: keyof MmiiShape){
    if (this.mmiiShape && this.mmiiShape[part] && this.hasColor(this.mmiiShape[part])) {
      return this.mmiiShape[part].color;
    }
    return;
  }
}
