import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Signal,
  signal
} from '@angular/core';
import { FlyingAreaComponent } from '../../components/flying-area/flying-area.component';
import { BirdComponent } from '../../components/bird/bird.component';
import { BirdDirection, Position, Size } from '../../types';
import {
  catchError,
  debounceTime,
  defaultIfEmpty,
  distinctUntilChanged,
  filter,
  fromEvent,
  interval,
  map,
  merge,
  Observable,
  of,
  take,
  tap
} from 'rxjs';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal
} from '@angular/core/rxjs-interop';
import { GameConfig } from '../../config/game-config';
import { GameStateService } from '../../services/game-state.service';
import { BirdSelectionComponent } from '../../components/bird-selection/bird-selection.component';
import { BIRDS } from '../../config/birds';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrl: './game-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlyingAreaComponent, BirdComponent, BirdSelectionComponent]
})
export class GameViewComponent implements AfterViewInit {
  private readonly isGameReady$: Observable<boolean>;

  private readonly windowSize$ = merge(
    of(this.getCurrentWindowSize()),
    fromEvent(window, 'resize').pipe(
      debounceTime(GameConfig.ResizeDebounceMs),
      map(() => this.getCurrentWindowSize())
    )
  );

  private readonly mousePosition$ = merge(
    of(this.getTopRightCorner()),
    fromEvent(document, 'mousemove').pipe(
      debounceTime(GameConfig.MouseMoveDebounceMs),
      map((event) => event as MouseEvent),
      map((event): Position => [event.clientX, event.clientY]),
      catchError(() => of(null)),
      filter((value) => !!value),
      defaultIfEmpty(this.getTopRightCorner()),
      distinctUntilChanged()
    )
  );

  protected readonly windowSize: Signal<Size> = toSignal(this.windowSize$, {
    initialValue: this.getCurrentWindowSize()
  });

  protected readonly mousePosition = toSignal(this.mousePosition$, {
    initialValue: this.getTopRightCorner()
  });

  protected birdsToSelect = signal(Object.values(BIRDS));
  protected readonly birdPosition = signal(this.getInitBirdPosition());
  protected readonly birdDirection = signal<BirdDirection>(BirdDirection.Right);

  protected readonly debouncedBirdDirection = toSignal(
    toObservable(this.birdDirection).pipe(
      debounceTime(GameConfig.BirdDirectionDebounceMs)
    ),
    { initialValue: BirdDirection.Right }
  );

  protected readonly birdWidth = computed(
    () => this.windowSize()[0] / GameConfig.BirdWidthDivider
  );

  constructor(
    protected readonly gameStateService: GameStateService,
    private readonly destroyRef: DestroyRef
  ) {
    this.isGameReady$ = toObservable(this.gameStateService.isGameReady);
  }

  ngAfterViewInit(): void {
    this.isGameReady$
      .pipe(
        filter((isReady) => isReady),
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.startAnimationLoop());
  }

  private getCurrentWindowSize(): Size {
    return [window.innerWidth, window.innerHeight];
  }

  private getTopRightCorner(): Position {
    return [this.getCurrentWindowSize()[0], 0];
  }

  private getInitBirdPosition(): Position {
    const [x, y] = this.getCurrentWindowSize();
    return [x / 2 - 50, y / 2 - 50];
  }

  private animationLoopStep(): Promise<void> {
    const [mouseX, mouseY] = this.mousePosition();
    const [birdX, birdY] = this.birdPosition();

    return new Promise((resolve) => {
      try {
        const xDistance = Math.abs(mouseX - birdX);
        const yDistance = Math.abs(mouseY - birdY);
        const distance = Math.sqrt(
          xDistance * xDistance + yDistance * yDistance
        );

        if (distance <= GameConfig.MaxDistanceToCursorPx) {
          return;
        }

        let angleRad = Math.asin(yDistance / distance);

        if (mouseX <= birdX && mouseY <= birdY) {
          angleRad = Math.PI - angleRad;
        } else if (mouseX <= birdX && mouseY >= birdY) {
          angleRad = Math.PI + angleRad;
        } else if (mouseX >= birdX && mouseY >= birdY) {
          angleRad = Math.PI * 2 - angleRad;
        }

        const a = -GameConfig.MovementSizePx * Math.sin(angleRad);
        const b = GameConfig.MovementSizePx * Math.cos(angleRad);

        this.birdPosition.update(([birdX, birdY]) => [birdX + b, birdY + a]);
        this.birdDirection.set(this.getBirdDirection(angleRad));
      } catch (err) {
        console.error(err);
      }

      resolve();
    });
  }

  private startAnimationLoop(): void {
    interval(GameConfig.AnimationIntervalMs)
      .pipe(
        tap(() => this.animationLoopStep()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private getBirdDirection(angleRad: number): BirdDirection {
    if (
      (angleRad > Math.PI / 2 && angleRad <= Math.PI) ||
      (angleRad > Math.PI && angleRad <= Math.PI + Math.PI / 2)
    ) {
      return BirdDirection.Left;
    }

    return BirdDirection.Right;
  }
}
