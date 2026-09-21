import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { Carrito } from '../../core/services/carrito';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly auth = inject(Auth);
  protected readonly carrito = inject(Carrito);

  login(): void {
    this.auth.login();
  }

  loginCreateAccount(): void {
    this.auth.loginCreateAccount();
  }

  logout(): void {
    this.auth.logout();
  }
}
