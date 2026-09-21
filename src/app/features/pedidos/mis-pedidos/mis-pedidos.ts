import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Pedido } from '../../../core/models/pedido';
import { PedidoService } from '../../../core/services/pedido.service';

@Component({
  selector: 'app-mis-pedidos',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.css',
})
export class MisPedidos implements OnInit {
  private readonly pedidoService = inject(PedidoService);

  protected readonly pedidos = signal<Pedido[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.pedidoService.listarMios().subscribe({
      next: (pedidos) => {
        this.pedidos.set(pedidos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar tu historial de pedidos.');
        this.cargando.set(false);
      },
    });
  }
}
