import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  HostListener,
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
import { FoodComponent } from '../../components/food/food.component';
import { EscapeMenuComponent } from '../../components/escape-menu/escape-menu.component';
import { Router } from '@angular/router';
import { ROUTE_URLS } from '../../config/route-urls';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrl: './game-view.component.scss',
  imports: [
    FlyingAreaComponent,
    BirdComponent,
    FoodComponent,
    EscapeMenuComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameViewComponent implements AfterViewInit {
  @HostListener('document:keydown.escape')
  onEscKeydownHandler() {
    if (this.escapeMenuOpened()) {
      this.escapeMenuOpened.set(false);
    } else {
      this.escapeMenuOpened.set(true);
    }
  }

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

  protected readonly mousePosition: Signal<Position> = toSignal(
    this.mousePosition$,
    {
      initialValue: this.getTopRightCorner()
    }
  );

  protected readonly escapeMenuOpened = signal(false);
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
    private readonly router: Router,
    private readonly destroyRef: DestroyRef
  ) {}

  ngAfterViewInit(): void {
    this.gameStateService.isGameReady$
      .pipe(
        filter((isReady) => isReady),
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.startAnimationLoop());
  }

  protected closeEscapeMenu(): void {
    this.escapeMenuOpened.set(false);
  }

  protected quitGame(): void {
    this.gameStateService.reset();
    void this.router.navigateByUrl(ROUTE_URLS.home());
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
