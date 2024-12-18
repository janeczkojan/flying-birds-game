import { CanActivateFn, Router } from '@angular/router';
import { DestroyRef, inject } from '@angular/core';
import { GameStateService } from '../services/game-state.service';
import { map, Observable, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { ROUTE_URLS } from '../config/route-urls';

export const canAccessBackgroundSelectionGuard: CanActivateFn = (
  route,
  state
): Observable<boolean> => {
  const router = inject(Router);
  const gameStateService = inject(GameStateService);
  const destroyRef = inject(DestroyRef);

  return combineLatest([
    gameStateService.initProcessStarted$,
    gameStateService.isBirdSelected$,
    gameStateService.isFoodSelected$
  ]).pipe(
    map((values) => values.every((value) => !!value)),
    take(1),
    tap((backgroundSelectionReady) => {
      if (!backgroundSelectionReady) {
        void router.navigateByUrl(`/${ROUTE_URLS.foodSelection()}`);
      }
    }),
    takeUntilDestroyed(destroyRef)
  );
};
