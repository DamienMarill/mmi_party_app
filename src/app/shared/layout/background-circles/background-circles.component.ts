import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {CicleService} from '../../services/cicle.service';
import {filter} from 'rxjs';

@Component({
  selector: 'app-background-circles',
  standalone: false,

  templateUrl: './background-circles.component.html',
  styleUrl: './background-circles.component.scss'
})
export class BackgroundCirclesComponent implements OnInit {
  circle1$;
  circle2$;

  constructor(
    private router: Router,
    private circleService: CicleService
  ) {
    this.circle1$ = this.circleService.circle1$;
    this.circle2$ = this.circleService.circle2$;
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.circleService.updateCircles();
    });
  }
}
