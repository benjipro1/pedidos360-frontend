import { Injectable, computed, signal } from '@angular/core';
import { CarritoItem } from '../models/carrito';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class Carrito {
  private readonly itemsMap = signal<Map<number, CarritoItem>>(new Map());

  readonly items = computed(() => Array.from(this.itemsMap().values()));
  readonly cantidadTotal = computed(() =>
    this.items().reduce((suma, item) => suma + item.cantidad, 0),
  );
  readonly total = computed(() =>
    this.items().reduce((suma, item) => suma + item.producto.precio * item.cantidad, 0),
  );

  agregar(producto: Producto, cantidad = 1): void {
    const map = new Map(this.itemsMap());
    const existente = map.get(producto.id);
    const nuevaCantidad = Math.min((existente?.cantidad ?? 0) + cantidad, producto.stock);
    map.set(producto.id, { producto, cantidad: nuevaCantidad });
    this.itemsMap.set(map);
  }

  actualizarCantidad(productoId: number, cantidad: number): void {
    const map = new Map(this.itemsMap());
    const existente = map.get(productoId);

    if (!existente) {
      return;
    }

    if (cantidad <= 0) {
      map.delete(productoId);
    } else {
      map.set(productoId, { ...existente, cantidad: Math.min(cantidad, existente.producto.stock) });
    }

    this.itemsMap.set(map);
  }

  quitar(productoId: number): void {
    const map = new Map(this.itemsMap());
    map.delete(productoId);
    this.itemsMap.set(map);
  }

  vaciar(): void {
    this.itemsMap.set(new Map());
  }
}
