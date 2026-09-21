import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pedido } from '../models/pedido';

/** Espeja DetalleItemRequest de ms-pedidos: los cuatro campos son obligatorios. */
export interface DetalleItemInput {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
}

/** Espeja PedidoRequest de ms-pedidos. El dueño del pedido no viaja en el cuerpo: lo resuelve el BFF desde el token. */
export interface PedidoInput {
  detalles: DetalleItemInput[];
}

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/pedidos`;

  /**
   * El backend ya filtra por el usuario autenticado: el BFF le pasa a
   * ms-pedidos la cabecera X-User-Email sacada del token, así que este GET
   * devuelve solo los pedidos propios. No existe un endpoint /mios.
   */
  listarMios(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.baseUrl);
  }

  crear(pedido: PedidoInput): Observable<Pedido> {
    return this.http.post<Pedido>(this.baseUrl, pedido);
  }
}
