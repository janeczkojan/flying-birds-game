import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'game',
    pathMatch: 'full'
  },
  {
    path: 'game',
    loadComponent: () =>
      import('../views/game/game.component').then((m) => m.GameComponent)
  }
];
