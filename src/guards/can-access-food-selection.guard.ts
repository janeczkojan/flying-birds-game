import { CanActivateFn, Router } from '@angular/router';
import { DestroyRef, inject } from '@angular/core';
import { GameStateService } from '../services/game-state.service';
import { combineLatest, map, Observable, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const canAccessFoodSelectionGuard: CanActivateFn = (
  route,
  state
): Observable<boolean> => {
  const router = inject(Router);
  const gameStateService = inject(GameStateService);
  const destroyRef = inject(DestroyRef);

  return combineLatest([
    gameStateService.initProcessStarted$,
    gameStateService.isBirdSelected$,
    gameStateService.isBackgroundSelected$
  ]).pipe(
    map((values) => values.every((value) => !!value)),
    take(1),
    tap((foodSelectionReady) => {
      if (!foodSelectionReady) {
        void router.navigateByUrl('/background-selection');
      }
    }),
    takeUntilDestroyed(destroyRef)
  );
};
