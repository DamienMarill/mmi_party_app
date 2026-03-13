import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { faChartBar, faGift, faLayerGroup, faUsers, faClock, faTrophy, faPercent, faMedal } from '@fortawesome/free-solid-svg-icons';
import { faCardsBlank } from '@fortawesome/pro-solid-svg-icons';
import { AssetsService } from '../../../shared/services/assets.service';

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
  mmii?: {
    shape: any;
    background: string;
  } | null;
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

interface PersonalStats {
  unique_cards: number;
  total_cards: number;
  total_versions: number;
  completion_rate: number;
  total_boosters: number;
  global_rank: number | null;
  rarity_breakdown: Record<string, { count: number; label: string }>;
}

interface PodiumSlot {
  rank: number;
  style: 'podium-gold' | 'podium-silver' | 'podium-bronze';
  medal: string;
  entries: PodiumEntry[];
}

const RANK_STYLE: Record<number, PodiumSlot['style']> = {
  1: 'podium-gold',
  2: 'podium-silver',
  3: 'podium-bronze',
};

const RANK_MEDAL: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

@Component({
  selector: 'app-stats',
  standalone: false,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  stats?: StatsData;
  personalStats?: PersonalStats;
  maxBoostersInDay = 0;

  readonly rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  readonly rarityColors: Record<string, string> = {
    common:    'badge-ghost',
    uncommon:  'badge-success',
    rare:      'badge-info',
    epic:      'badge-secondary',
    legendary: 'badge-warning',
  };

  fa = {
    faChartBar, faGift, faLayerGroup, faUsers,
    faClock, faTrophy, faCardsBlank, faPercent, faMedal
  };

  constructor(private apiService: ApiService, public assetsService: AssetsService) {}

  ngOnInit(): void {
    this.apiService.request<StatsData>('GET', '/stats', null, undefined, { skipAuth: true })
      .subscribe(data => {
        this.stats = data;
        this.maxBoostersInDay = Math.max(...data.boosters_per_day.map(d => d.count), 1);
      });

    this.apiService.request<PersonalStats>('GET', '/stats/me')
      .subscribe(data => this.personalStats = data);
  }

  /** Regroupe les entrées podium par rang, ordonnées visuellement : 2ème, 1er, 3ème */
  get podiumSlots(): PodiumSlot[] {
    if (!this.stats) return [];

    const podiumEntries = this.stats.podium.filter(e => e.rank <= 3);
    const grouped = new Map<number, PodiumEntry[]>();
    for (const entry of podiumEntries) {
      if (!grouped.has(entry.rank)) grouped.set(entry.rank, []);
      grouped.get(entry.rank)!.push(entry);
    }

    // Ordre visuel classique : argent (gauche), or (centre), bronze (droite)
    const visualOrder = [2, 1, 3];
    return visualOrder
      .filter(rank => grouped.has(rank))
      .map(rank => ({
        rank,
        style: RANK_STYLE[rank],
        medal: RANK_MEDAL[rank],
        entries: grouped.get(rank)!,
      }));
  }

  /** Joueurs classés 4ème et plus (jusqu'à 10ème) */
  get leaderboard(): PodiumEntry[] {
    if (!this.stats) return [];
    return this.stats.podium.filter(e => e.rank > 3);
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
