import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'bienvenida', pathMatch: 'full' },
  {
    path: 'bienvenida',
    loadComponent: () => import('./components/bienvenida/bienvenida.component').then(m => m.BienvenidaComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'autenticacion',
    loadChildren: () => import('./components/autenticacion/autenticacion.routes').then(m => m.routes)
  },
  {
    path: 'quien-soy',
    loadComponent: () => import('./components/quien-soy/quien-soy.component').then(m => m.QuienSoyComponent)
  },
  {
    path: 'juegos',
    loadChildren: () => import('./components/juegos/juegos.routes').then(m => m.routes)
  },
  {
    path: '**',
    loadComponent: () => import('./components/error/error.component').then(m => m.ErrorComponent)
  },
];
