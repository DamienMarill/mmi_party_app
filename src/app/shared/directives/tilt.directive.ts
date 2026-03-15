import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2} from '@angular/core';
import VanillaTilt from 'vanilla-tilt';

@Directive({
  selector: '[appTilt]',
  standalone: false
})
export class TiltDirective implements AfterViewInit, OnDestroy {
  @Input() tiltMax = 15;
  @Input() tiltSpeed = 400;
  @Input() tiltGlare = true;
  @Input() tiltMaxGlare = 0.25;
  @Input() tiltGyroscope = true;
  @Input() tiltScale = 1.02;
  @Input() tiltHolographic = false;

  private holoOverlay?: HTMLElement;
  private tiltChangeHandler?: (e: Event) => void;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;

    // Ensure the element can contain the overlay
    const position = getComputedStyle(element).position;
    if (position === 'static') {
      this.renderer.setStyle(element, 'position', 'relative');
    }

    VanillaTilt.init(element, {
      max: this.tiltMax,
      speed: this.tiltSpeed,
      glare: !this.tiltHolographic,
      'max-glare': this.tiltMaxGlare,
      gyroscope: this.tiltGyroscope,
      scale: this.tiltScale,
      perspective: 1000,
    });

    if (this.tiltHolographic) {
      this.createHolographicOverlay();
    }
  }

  private createHolographicOverlay(): void {
    const overlay = this.renderer.createElement('div');

    // Base styles for the holographic overlay
    Object.assign(overlay.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '20',
      pointerEvents: 'none',
      opacity: '0',
      mixBlendMode: 'screen',
      borderRadius: 'inherit',
      transition: 'opacity 0.3s ease',
      background: `
        repeating-conic-gradient(
          from 0deg,
          rgba(255, 0, 0, 0.6) 0deg,
          rgba(255, 165, 0, 0.6) 51deg,
          rgba(255, 255, 0, 0.6) 102deg,
          rgba(0, 255, 0, 0.6) 153deg,
          rgba(0, 127, 255, 0.6) 204deg,
          rgba(139, 0, 255, 0.6) 255deg,
          rgba(255, 0, 0, 0.6) 306deg
        )`,
      backgroundSize: '150% 150%',
      backgroundPosition: '50% 50%',
      filter: 'blur(2px) saturate(3)',
    });

    this.renderer.appendChild(this.el.nativeElement, overlay);
    this.holoOverlay = overlay;

    // Listen to tilt changes to animate the holographic effect
    this.tiltChangeHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || !this.holoOverlay) return;

      const {tiltX, tiltY} = detail;
      const posX = 50 + (tiltY / this.tiltMax) * 50;
      const posY = 50 + (tiltX / this.tiltMax) * 50;
      const intensity = Math.sqrt(tiltX * tiltX + tiltY * tiltY) / this.tiltMax;

      this.holoOverlay.style.backgroundPosition = `${posX}% ${posY}%`;
      this.holoOverlay.style.opacity = `${Math.min(0.15 + intensity * 0.6, 0.7)}`;
    };

    this.el.nativeElement.addEventListener('tiltChange', this.tiltChangeHandler);
  }

  ngOnDestroy(): void {
    if (this.tiltChangeHandler) {
      this.el.nativeElement.removeEventListener('tiltChange', this.tiltChangeHandler);
    }
    const tiltElement = this.el.nativeElement as any;
    if (tiltElement.vanillaTilt) {
      tiltElement.vanillaTilt.destroy();
    }
  }
}
