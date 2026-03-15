import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalConfig {
  type: 'alert' | 'confirm';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  resolve: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private _modal = new Subject<ModalConfig | null>();
  public modal$ = this._modal.asObservable();

  alert(message: string, title = 'Information'): Promise<void> {
    return new Promise((resolve) => {
      this._modal.next({
        type: 'alert',
        title,
        message,
        confirmText: 'OK',
        resolve: () => resolve(),
      });
    });
  }

  confirm(message: string, title = 'Confirmation'): Promise<boolean> {
    return new Promise((resolve) => {
      this._modal.next({
        type: 'confirm',
        title,
        message,
        confirmText: 'Confirmer',
        cancelText: 'Annuler',
        resolve,
      });
    });
  }

  close(result: boolean): void {
    this._modal.next(null);
  }
}
