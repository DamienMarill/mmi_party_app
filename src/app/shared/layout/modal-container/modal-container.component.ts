import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalConfig, ModalService } from '../../services/modal.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-modal-container',
  standalone: false,
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalContainerComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private destroy$ = new Subject<void>();

  current: ModalConfig | null = null;
  visible = false;

  ngOnInit(): void {
    this.modalService.modal$.pipe(takeUntil(this.destroy$)).subscribe((config) => {
      if (config) {
        this.current = config;
        requestAnimationFrame(() => (this.visible = true));
      } else {
        this.visible = false;
        setTimeout(() => (this.current = null), 300);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onConfirm(): void {
    this.current?.resolve(true);
    this.modalService.close(true);
  }

  onCancel(): void {
    this.current?.resolve(false);
    this.modalService.close(false);
  }

  onBackdrop(): void {
    if (this.current?.type === 'alert') {
      this.onConfirm();
    } else {
      this.onCancel();
    }
  }
}
