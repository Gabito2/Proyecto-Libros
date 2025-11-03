import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'carrito-form', loadComponent: () => import('./pages/carrito-form/carrito-form.component').then((m) => m.CarritoFormComponent),
  },
  {
    path: 'carrito', loadComponent: () => import('../app/pages/carrito/carrito.component').then((m) => m.CarritoComponent),
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
