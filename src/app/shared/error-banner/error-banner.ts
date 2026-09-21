import { Component, inject } from '@angular/core';
import { ErrorNotification } from '../../core/services/error-notification';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-error-banner',
  imports: [],
  templateUrl: './error-banner.html',
  styleUrl: './error-banner.css',
})
export class ErrorBanner {
  protected readonly errorNotification = inject(ErrorNotification);
  private readonly auth = inject(Auth);

  dismiss(): void {
    this.errorNotification.clear();
  }

  iniciarSesion(): void {
    this.errorNotification.clear();
    this.auth.login();
  }
}
