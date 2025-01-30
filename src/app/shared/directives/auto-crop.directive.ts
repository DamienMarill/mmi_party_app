import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {timer} from 'rxjs';

@Directive({
  selector: '[appAutoCrop]',
  standalone: false
})
export class AutoCropDirective implements AfterViewInit {
  @Input() padding = 0;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    timer(500).subscribe(() => {
      const img = this.el.nativeElement;
      this.cropTransparentBorders(img)
      // img.onload = () => this.cropTransparentBorders(img);
    });

  }

  private cropTransparentBorders(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const bounds = this.getBounds(imageData);

    if (bounds) {
      // Ajout du padding
      bounds.left = Math.max(0, bounds.left - this.padding);
      bounds.top = Math.max(0, bounds.top - this.padding);
      bounds.right = Math.min(canvas.width, bounds.right + this.padding);
      bounds.bottom = Math.min(canvas.height, bounds.bottom + this.padding);

      // Création de l'image rognée
      const croppedCanvas = document.createElement('canvas');
      const croppedCtx = croppedCanvas.getContext('2d');

      if (!croppedCtx) return;

      croppedCanvas.width = bounds.right - bounds.left;
      croppedCanvas.height = bounds.bottom - bounds.top;

      croppedCtx.drawImage(
        canvas,
        bounds.left, bounds.top,
        bounds.right - bounds.left,
        bounds.bottom - bounds.top,
        0, 0,
        bounds.right - bounds.left,
        bounds.bottom - bounds.top
      );

      img.src = croppedCanvas.toDataURL();
    }
  }

  private getBounds(imageData: ImageData) {
    const { width, height, data } = imageData;
    let left = width;
    let top = height;
    let right = 0;
    let bottom = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = data[((width * y) + x) * 4 + 3];
        if (alpha !== 0) {
          left = Math.min(x, left);
          right = Math.max(x, right);
          top = Math.min(y, top);
          bottom = Math.max(y, bottom);
        }
      }
    }

    // Vérification si l'image n'est pas entièrement transparente
    return left < right && top < bottom ? { left, right: right + 1, top, bottom: bottom + 1 } : null;
  }

}
