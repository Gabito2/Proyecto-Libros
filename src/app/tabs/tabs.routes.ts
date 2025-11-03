import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: 'home', loadComponent: () => import('../pages/pagina_principal/pagina_principal').then(m => m.Principal) },
      { path: 'biblioteca', loadComponent: () => import('../pages/list-libro/biblioteca').then(m => m.BibliotecaPage) },
      { path: 'biblioteca/:id', loadComponent: () => import('../pages/form-libro/form').then(m => m.FormPage) },
      { path: 'form', loadComponent: () => import('../pages/form-libro/form').then(m => m.FormPage) },
      { path: 'favorito', loadComponent: () => import('../pages/libros_favoritos/favorito').then(m => m.Favorito) },
      { path: '', redirectTo: '/tabs/home', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
