import { Routes } from '@angular/router';
import { HomeViewComponent } from '../views/home-view/home-view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeViewComponent
  },
  {
    path: 'bird-selection',
    pathMatch: 'full',
    loadComponent: () =>
      import('../views/bird-selection-view/bird-selection-view.component').then(
        (m) => m.BirdSelectionViewComponent
      )
  },
  {
    path: 'game',
    pathMatch: 'full',
    loadComponent: () =>
      import('../views/game-view/game-view.component').then(
        (m) => m.GameViewComponent
      )
  }
];
