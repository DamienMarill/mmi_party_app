import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {EventCheckService, UnlockedCard} from '../../services/event-check.service';
import {AssetsService} from '../../services/assets.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-event-modal',
  standalone: false,
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss'],
})
export class EventModalComponent implements OnInit, OnDestroy {
  private eventCheckService = inject(EventCheckService);
  public assetsService = inject(AssetsService);
  private destroy$ = new Subject<void>();

  queue: UnlockedCard[] = [];
  current: UnlockedCard | null = null;
  visible = false;

  ngOnInit(): void {
    this.eventCheckService.unlockedCards$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cards) => {
        this.queue.push(...cards);
        if (!this.current) {
          this.showNext();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showNext(): void {
    if (this.queue.length === 0) {
      this.current = null;
      this.visible = false;
      return;
    }
    this.current = this.queue.shift()!;
    requestAnimationFrame(() => (this.visible = true));
  }

  dismiss(): void {
    this.visible = false;
    setTimeout(() => this.showNext(), 400);
  }
}
