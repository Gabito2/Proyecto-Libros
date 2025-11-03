import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: 'home', loadComponent: () => import('../pagina_principal/pagina_principal').then(m => m.Principal) },
      { path: 'biblioteca', loadComponent: () => import('../biblioteca/biblioteca').then(m => m.Biblioteca) },
      { path: 'biblioteca/:id', loadComponent: () => import('../form/form').then(m => m.Form) },
      { path: 'form', loadComponent: () => import('../form/form').then(m => m.Form) },
      { path: 'favorito', loadComponent: () => import('../libros_favoritos/favorito').then(m => m.Favorito) },
      { path: '', redirectTo: '/tabs/home', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
