import { Injectable, signal } from '@angular/core';

export interface ErrorNotificationPayload {
  status: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorNotification {
  readonly current = signal<ErrorNotificationPayload | null>(null);

  show(status: number, message: string): void {
    this.current.set({ status, message });
  }

  clear(): void {
    this.current.set(null);
  }
}
