import { Injectable, computed, signal } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { Rol } from '../models/rol';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly account = signal<AccountInfo | null>(null);

  readonly isAuthenticated = computed(() => this.account() !== null);
  readonly displayName = computed(
    () => this.account()?.name || this.account()?.username || '',
  );
  readonly roles = computed<Rol[]>(
    () => (this.account()?.idTokenClaims?.['roles'] as Rol[] | undefined) ?? [],
  );

  constructor(private readonly msalService: MsalService) {}

  /** Sincroniza el estado local con la cuenta activa de MSAL. Llamar cuando no hay interacciones en progreso. */
  refreshAccountState(): void {
    const accounts = this.msalService.instance.getAllAccounts();
    let active = this.msalService.instance.getActiveAccount();

    if (!active && accounts.length > 0) {
      active = accounts[0];
      this.msalService.instance.setActiveAccount(active);
    }

    this.account.set(active);
  }

  hasRole(rol: Rol): boolean {
    return this.roles().includes(rol);
  }

  login(): void {
    this.msalService.loginRedirect();
  }

  loginCreateAccount(): void {
    this.msalService.loginRedirect({
      scopes: [],
      prompt: 'create',
    });
  }

  logout(): void {
    this.msalService.logoutRedirect();
  }
}
