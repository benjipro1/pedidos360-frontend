import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Carrito } from '../../../core/services/carrito';
import { CarritoItem } from '../../../core/models/carrito';
import { PedidoService } from '../../../core/services/pedido.service';

@Component({
  selector: 'app-crear-pedido',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './crear-pedido.html',
  styleUrl: './crear-pedido.css',
})
export class CrearPedido {
  protected readonly carrito = inject(Carrito);
  private readonly pedidoService = inject(PedidoService);
  private readonly router = inject(Router);

  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);

  actualizarCantidad(item: CarritoItem, valor: string): void {
    const cantidad = Number(valor);
    this.carrito.actualizarCantidad(item.producto.id, Number.isFinite(cantidad) ? cantidad : 0);
  }

  quitar(productoId: number): void {
    this.carrito.quitar(productoId);
  }

  confirmar(): void {
    if (this.carrito.items().length === 0 || this.enviando()) {
      return;
    }

    this.enviando.set(true);
    this.error.set(null);

    const detalles = this.carrito.items().map((item) => ({
      productoId: item.producto.id,
      nombreProducto: item.producto.nombre,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio,
    }));

    this.pedidoService.crear({ detalles }).subscribe({
      next: () => {
        this.enviando.set(false);
        this.carrito.vaciar();
        this.router.navigateByUrl('/pedidos/mios');
      },
      error: () => {
        this.enviando.set(false);
        this.error.set('No se pudo crear el pedido. Intenta nuevamente.');
      },
    });
  }
}
