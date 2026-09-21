import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { Home } from './features/home/home';
import { Catalogo } from './features/catalogo/catalogo';
import { CrearPedido } from './features/pedidos/crear-pedido/crear-pedido';
import { MisPedidos } from './features/pedidos/mis-pedidos/mis-pedidos';
import { Productos } from './features/admin/productos/productos';
import { SinPermiso } from './features/sin-permiso/sin-permiso';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'catalogo', component: Catalogo },
  { path: 'pedidos/crear', component: CrearPedido, canActivate: [MsalGuard] },
  { path: 'pedidos/mios', component: MisPedidos, canActivate: [MsalGuard] },
  {
    path: 'admin/productos',
    component: Productos,
    canActivate: [MsalGuard, roleGuard('Admin')],
  },
  { path: 'sin-permiso', component: SinPermiso },
  { path: '**', redirectTo: '' },
];
