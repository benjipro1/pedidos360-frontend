/** Espeja EstadoPedido de ms-pedidos: el backend serializa el enum en mayúsculas. */
export type EstadoPedido = 'PENDIENTE' | 'PAGADO' | 'ENVIADO' | 'CANCELADO';

/** Espeja DetallePedidoResponse de ms-pedidos. */
export interface DetallePedido {
  id: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
}

/** Espeja PedidoResponse de ms-pedidos. */
export interface Pedido {
  id: number;
  usuarioEmail: string;
  fechaCreacion: string;
  estado: EstadoPedido;
  total: number;
  detalles: DetallePedido[];
}
