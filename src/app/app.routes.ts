import { Routes } from '@angular/router';
import { HomeViewComponent } from '../views/home-view/home-view.component';
import { canAccessBirdSelectionGuard } from '../guards/can-access-bird-selection.guard';
import { canAccessGameGuard } from '../guards/can-access-game.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeViewComponent
  },
  {
    path: 'bird-selection',
    pathMatch: 'full',
    canActivate: [canAccessBirdSelectionGuard],
    loadComponent: () =>
      import('../views/bird-selection-view/bird-selection-view.component').then(
        (m) => m.BirdSelectionViewComponent
      )
  },
  {
    path: 'game',
    pathMatch: 'full',
    canActivate: [canAccessGameGuard],
    loadComponent: () =>
      import('../views/game-view/game-view.component').then(
        (m) => m.GameViewComponent
      )
  }
];
