import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'bienvenida', pathMatch: 'full' },
  {
    path: 'bienvenida',
    loadComponent: () => import('./components/bienvenida/bienvenida.component').then((m) => m.BienvenidaComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./components/registro/registro.component').then((m) => m.RegistroComponent)
  },
  {
    path: 'quien-soy',
    loadComponent: () => import('./components/quien-soy/quien-soy.component').then((m) => m.QuienSoyComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./components/error/error.component').then((m) => m.ErrorComponent)
  },
];
