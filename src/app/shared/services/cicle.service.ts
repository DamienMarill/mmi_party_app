import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CicleService {
  private colors = [
    'bg-rarity-common',
    'bg-rarity-uncommon',
    'bg-rarity-rare',
    'bg-rarity-epic',
  ];

  private circle1 = new BehaviorSubject<Circle>({
    color: this.getRandomColor(),
    position: this.getRandomPosition()
  });

  private circle2 = new BehaviorSubject<Circle>({
    color: this.getRandomColor(),
    position: this.getRandomPosition()
  });

  circle1$ = this.circle1.asObservable();
  circle2$ = this.circle2.asObservable();

  private getRandomColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  private getRandomPosition() {
    return {
      x: Math.random() * 100,
      y: Math.random() * 100
    };
  }

  updateCircles() {
    this.circle1.next({
      color: this.getRandomColor(),
      position: this.getRandomPosition()
    });
    this.circle2.next({
      color: this.getRandomColor(),
      position: this.getRandomPosition()
    });
  }
}

interface Circle {
  color: string;
  position: { x: number; y: number };
}
