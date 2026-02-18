import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { faChartBar, faGift, faLayerGroup, faUsers, faClock, faTrophy } from '@fortawesome/free-solid-svg-icons';

interface RegistrationLevel {
  level: number;
  label: string;
  registered: number;
  total: number;
}

interface BoosterDay {
  date: string;
  label: string;
  count: number;
}

interface PodiumEntry {
  rank: number;
  name: string;
  unique_cards: number;
}

interface StatsData {
  registrations: RegistrationLevel[];
  global: {
    total_boosters: number;
    total_cards: number;
    active_players: number;
  };
  boosters_per_day: BoosterDay[];
  podium: PodiumEntry[];
}

@Component({
  selector: 'app-stats',
  standalone: false,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  stats?: StatsData;
  maxBoostersInDay = 0;

  fa = {
    faChartBar,
    faGift,
    faLayerGroup,
    faUsers,
    faClock,
    faTrophy
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.request<StatsData>('GET', '/stats', null, undefined, { skipAuth: true })
      .subscribe(data => {
        this.stats = data;
        this.maxBoostersInDay = Math.max(...data.boosters_per_day.map(d => d.count), 1);
      });
  }

  getPercentage(registered: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((registered / total) * 100);
  }

  getBarHeight(count: number): number {
    if (this.maxBoostersInDay === 0) return 0;
    return Math.round((count / this.maxBoostersInDay) * 100);
  }
}
