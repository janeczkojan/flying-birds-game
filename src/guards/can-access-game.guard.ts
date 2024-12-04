import { CanActivateFn, Router } from '@angular/router';
import { DestroyRef, inject } from '@angular/core';
import { GameStateService } from '../services/game-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, take, tap } from 'rxjs';

export const canAccessGameGuard: CanActivateFn = (
  route,
  state
): Observable<boolean> => {
  const router = inject(Router);
  const gameStateService = inject(GameStateService);
  const destroyRef = inject(DestroyRef);

  return gameStateService.isGameReady$.pipe(
    take(1),
    tap((gameReady) => {
      if (!gameReady) {
        void router.navigateByUrl('/bird-selection');
      }
    }),
    takeUntilDestroyed(destroyRef)
  );
};