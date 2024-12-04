import { CanActivateFn, Router } from '@angular/router';
import { DestroyRef, inject } from '@angular/core';
import { GameStateService } from '../services/game-state.service';
import { Observable, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const canAccessBirdSelectionGuard: CanActivateFn = (
  route,
  state
): Observable<boolean> => {
  const router = inject(Router);
  const gameStateService = inject(GameStateService);
  const destroyRef = inject(DestroyRef);

  return gameStateService.initProcessStarted$.pipe(
    take(1),
    tap((initProcessStarted) => {
      if (!initProcessStarted) {
        void router.navigateByUrl('/');
      }
    }),
    takeUntilDestroyed(destroyRef)
  );
};
