import {Component, Input} from '@angular/core';
import {environment} from '../../../../environments/environment';
import { Mmii } from '../../interfaces/mmii';
import {MmiiShape} from '../../interfaces/mmii-shape';

@Component({
  selector: 'app-mmii',
  standalone: false,

  templateUrl: './mmii.component.html',
  styleUrl: './mmii.component.scss'
})
export class MmiiComponent {
  @Input()size: string = '20rem';
  @Input()mmiiShapes?: MmiiShape;

  baseFolder = environment.storage + '/mmii';

  constructor() {
    this.mmiiShapes = {
        bouche: {
          img: 'mouth1.png'
        },
        cheveux: {
          img: 'hair1.png',
          color: '#4A2C2A'
        },
        nez: {
          img: 'nez1.png'
        },
        tete: {
          img: 'tete1.png',
          color: '#0F0'
        },
        yeux: {
          img: 'eyes1.png',
          color: '#8b5a2b'
        }
      };
  }

  hexToHSL(hex: string) {
    // On retire le # si présent
    hex = hex.replace(/^#/, '');

    // Conversion en RGB
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

      switch(max) {
        case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
        case g: h = (b - r) / diff + 2; break;
        case b: h = (r - g) / diff + 4; break;
      }

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  getHairFilter(hexColor: string): string {
    hexColor = '#c95514';

    const hls = this.hexToHSL(hexColor);

    console.log(hls);

    const filter = `hue-rotate(${hls.h}deg)
            saturate(${hls.s}%)
            brightness(${hls.l}%)`
    console.log(filter);
    return filter;
  }

  getBrightness(hexColor: string): number {
    const r = parseInt(hexColor.slice(1, 3), 16) / 255;
    const g = parseInt(hexColor.slice(3, 5), 16) / 255;
    const b = parseInt(hexColor.slice(5, 7), 16) / 255;

    return (Math.max(r, g, b) * 100);
  }
}
