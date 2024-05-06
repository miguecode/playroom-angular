import { Routes } from '@angular/router';

export const routes: Routes = [
{
  path: 'ahorcado',
 loadComponent: () => import('./ahorcado/ahorcado.component').then(m => m.AhorcadoComponent)
},
{
  path: 'mayor-menor',
 loadComponent: () => import('./mayor-menor/mayor-menor.component').then(m => m.MayorMenorComponent)
},
];