/** Espeja ProductoResponse de ms-productos. El precio es un entero (pesos sin decimales). */
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  activo: boolean;
}
