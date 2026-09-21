import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../core/models/producto';
import { ProductoInput, ProductoService } from '../../../core/services/producto.service';

const FORMULARIO_VACIO: ProductoInput = {
  nombre: '',
  descripcion: '',
  precio: 0,
  stock: 0,
};

@Component({
  selector: 'app-productos',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  private readonly productoService = inject(ProductoService);

  protected readonly productos = signal<Producto[]>([]);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly editandoId = signal<number | null>(null);

  protected form: ProductoInput = { ...FORMULARIO_VACIO };

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.productoService.listar().subscribe({
      next: (productos) => {
        this.productos.set(productos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el listado de productos.');
        this.cargando.set(false);
      },
    });
  }

  nuevo(): void {
    this.editandoId.set(null);
    this.form = { ...FORMULARIO_VACIO };
  }

  editar(producto: Producto): void {
    this.editandoId.set(producto.id);
    this.form = {
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      precio: producto.precio,
      stock: producto.stock,
      activo: producto.activo,
    };
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.form = { ...FORMULARIO_VACIO };
  }

  guardar(): void {
    this.guardando.set(true);
    this.error.set(null);

    const id = this.editandoId();
    const operacion = id
      ? this.productoService.actualizar(id, this.form)
      : this.productoService.crear(this.form);

    operacion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cancelar();
        this.cargar();
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('No se pudo guardar el producto.');
      },
    });
  }

  /** El backend hace baja lógica: el producto queda inactivo y se puede reactivar editándolo. */
  darDeBaja(producto: Producto): void {
    if (!confirm(`¿Dar de baja "${producto.nombre}"? Dejará de aparecer en el catálogo.`)) {
      return;
    }

    this.productoService.eliminar(producto.id).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('No se pudo dar de baja el producto.'),
    });
  }
}
