import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';
import {timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {

  constructor() { }

  defineStars() {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
    };

    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star']
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ['circle']
    });
  }

  stars(){
    this.defineStars();
    timer(100).subscribe(() => { this.defineStars(); });
    timer(200).subscribe(() => { this.defineStars(); });
    timer(300).subscribe(() => { this.defineStars(); });
    timer(400).subscribe(() => { this.defineStars(); });
  }

  cannon(){
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  doubleCannon(){
    this.cannon();
    timer(100).subscribe(() => { this.cannon(); });
  }

  public randomInRange(min: number, max: number):number {
    return Math.random() * (max - min) + min;
  }

  fireworks() {
    var duration = 3000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    var interval = setInterval(() => {  // <- Changé ici
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: this.randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: this.randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }
}
