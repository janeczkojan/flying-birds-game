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
  of,
  tap
} from 'rxjs';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal
} from '@angular/core/rxjs-interop';

const RESIZE_DEBOUNCE_MS = 10;
const MOUSE_MOVE_DEBOUNCE_MS = 4;
const BIRD_DIRECTION_DEBOUNCE_MS = 100;
const ANIMATION_INTERVAL_MS = 20;
const BIRD_WIDTH_DIVIDER = 10;
const MOVEMENT_SIZE = 5;

@Component({
  selector: 'app-game',
  imports: [FlyingAreaComponent, BirdComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements AfterViewInit {
  private readonly windowSize$ = merge(
    of(this.getCurrentWindowSize()),
    fromEvent(window, 'resize').pipe(
      debounceTime(RESIZE_DEBOUNCE_MS),
      map(() => this.getCurrentWindowSize())
    )
  );

  private readonly mousePosition$ = merge(
    of(this.getTopRightCorner()),
    fromEvent(document, 'mousemove').pipe(
      debounceTime(MOUSE_MOVE_DEBOUNCE_MS),
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

  protected readonly birdPosition = signal(this.getInitBirdPosition());
  protected readonly birdDirection = signal<BirdDirection>(BirdDirection.Right);

  protected readonly debouncedBirdDirection = toSignal(
    toObservable(this.birdDirection).pipe(
      debounceTime(BIRD_DIRECTION_DEBOUNCE_MS)
    ),
    { initialValue: BirdDirection.Right }
  );

  protected readonly birdWidth = computed(
    () => this.windowSize()[0] / BIRD_WIDTH_DIVIDER
  );

  constructor(private readonly destroyRef: DestroyRef) {}

  ngAfterViewInit(): void {
    this.startAnimationLoop();
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

        let angleRad = Math.asin(yDistance / distance);

        if (mouseX <= birdX && mouseY <= birdY) {
          angleRad = Math.PI - angleRad;
        } else if (mouseX <= birdX && mouseY >= birdY) {
          angleRad = Math.PI + angleRad;
        } else if (mouseX >= birdX && mouseY >= birdY) {
          angleRad = Math.PI * 2 - angleRad;
        }

        const a = -MOVEMENT_SIZE * Math.sin(angleRad);
        const b = MOVEMENT_SIZE * Math.cos(angleRad);

        this.birdPosition.update(([birdX, birdY]) => [birdX + b, birdY + a]);
        this.birdDirection.set(this.getBirdDirection(angleRad));
      } catch (err) {
        console.error(err);
      }

      resolve();
    });
  }

  private startAnimationLoop(): void {
    interval(ANIMATION_INTERVAL_MS)
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
