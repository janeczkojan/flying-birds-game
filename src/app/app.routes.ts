import { Routes } from '@angular/router';
import { HomeViewComponent } from '../views/home-view/home-view.component';
import { canAccessBirdSelectionGuard } from '../guards/can-access-bird-selection.guard';
import { canAccessGameGuard } from '../guards/can-access-game.guard';
import { canAccessBackgroundSelectionGuard } from '../guards/can-access-background-selection.guard';
import { canAccessFoodSelectionGuard } from '../guards/can-access-food-selection.guard';
import { ROUTE_URLS } from '../config/route-urls';

export const routes: Routes = [
  {
    path: ROUTE_URLS.home(),
    pathMatch: 'full',
    component: HomeViewComponent
  },
  {
    path: ROUTE_URLS.birdSelection(),
    pathMatch: 'full',
    canActivate: [canAccessBirdSelectionGuard],
    loadComponent: () =>
      import('../views/bird-selection-view/bird-selection-view.component').then(
        (m) => m.BirdSelectionViewComponent
      )
  },
  {
    path: ROUTE_URLS.foodSelection(),
    pathMatch: 'full',
    canActivate: [canAccessFoodSelectionGuard],
    loadComponent: () =>
      import('../views/food-selection-view/food-selection-view.component').then(
        (m) => m.FoodSelectionViewComponent
      )
  },
  {
    path: ROUTE_URLS.backgroundSelection(),
    pathMatch: 'full',
    canActivate: [canAccessBackgroundSelectionGuard],
    loadComponent: () =>
      import(
        '../views/background-selection-view/background-selection-view.component'
      ).then((m) => m.BackgroundSelectionViewComponent)
  },
  {
    path: ROUTE_URLS.game(),
    pathMatch: 'full',
    canActivate: [canAccessGameGuard],
    loadComponent: () =>
      import('../views/game-view/game-view.component').then(
        (m) => m.GameViewComponent
      )
  }
];
