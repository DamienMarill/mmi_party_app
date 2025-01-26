import {Component, OnInit} from '@angular/core';
import {faBookSparkles, faHouse, faRightLeftLarge, faSwords, faXmark} from '@fortawesome/pro-regular-svg-icons';
import { faBookSparkles as faBookSparklesS , faHouse as faHouseS, faRightLeftLarge as faRightLeftLargeS, faSwords as faSwordsS } from '@fortawesome/pro-solid-svg-icons';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { Location } from '@angular/common'
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NavConfig} from '../../interfaces/nav-config';
import {filter} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  animations: [
    trigger('slideAnimation', [
      state('visible', style({ transform: 'translateY(0)' })),
      state('hidden', style({ transform: 'translateY(60%)' })),
      transition('visible <=> hidden', animate('300ms ease-in-out'))
    ]),
    trigger('opacityAnimation', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible <=> hidden', animate('150ms ease-in-out'))
    ])
  ]
})
export class NavbarComponent implements OnInit {
    navConfig: NavConfig = { showNav: true, showBack: false };

    iconsInactive = {
      faHouse, faBookSparkles, faRightLeftLarge, faSwords
    }

    iconsActive = {
      faHouse : faHouseS,
      faBookSparkles: faBookSparklesS,
      faRightLeftLarge: faRightLeftLargeS,
      faSwords: faSwordsS
    }

    icons = {
      faXmark
    }

    constructor(
      private location: Location,
      private router: Router,
      private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
      ).subscribe(route => {
        const configs: NavConfig[] = [];

        // Récupère toutes les configs de la hiérarchie de routes
        let currentRoute: ActivatedRoute | null = route;
        while (currentRoute) {
          if (currentRoute.snapshot.data['nav']) {
            configs.push(currentRoute.snapshot.data['nav']);
          }
          currentRoute = currentRoute.firstChild;
        }

        // Fusionne les configs, la dernière (enfant) est prioritaire
        this.navConfig = configs.reduce((acc, curr) => ({
          showNav: curr.showNav !== undefined ? curr.showNav : acc.showNav,
          showBack: curr.showBack !== undefined ? curr.showBack : acc.showBack
        }), { showNav: true, showBack: false });
      });
    }

    goBack(): void {
  // Récupère l'état de l'historique actuel
      const state = this.location.getState() as { navigationId: number };

  // Supprime l'entrée actuelle de l'historique
      this.location.replaceState('');

  // Si on a un historique, on revient en arrière
      if (state && state.navigationId > 1) {
        this.location.back();
      } else {
  // Si pas d'historique, redirection vers une route par défaut
        this.router.navigate(['/home']);
      }
    }
}
