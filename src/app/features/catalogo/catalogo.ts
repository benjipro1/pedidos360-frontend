import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Carrito } from '../../core/services/carrito';
import { Producto } from '../../core/models/producto';
import { ProductoService } from '../../core/services/producto.service';

@Component({
  selector: 'app-catalogo',
  imports: [CurrencyPipe],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  private readonly productoService = inject(ProductoService);
  protected readonly carrito = inject(Carrito);

  protected readonly productos = signal<Producto[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.productoService.listar().subscribe({
      // El backend devuelve también los dados de baja (la eliminación es
      // lógica: marca activo=false). El catálogo público solo muestra los activos.
      next: (productos) => {
        this.productos.set(productos.filter((producto) => producto.activo));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el catálogo. Intenta nuevamente.');
        this.cargando.set(false);
      },
    });
  }

  agregar(producto: Producto): void {
    this.carrito.agregar(producto);
  }
}
