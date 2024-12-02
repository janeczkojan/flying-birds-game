import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  signal
} from '@angular/core';
import { FlyingAreaComponent } from '../../components/flying-area/flying-area.component';
import { BirdComponent } from '../../components/bird/bird.component';
import { Position, Size } from '../../types';
import {
  catchError,
  combineLatest,
  debounceTime,
  defaultIfEmpty,
  filter,
  fromEvent,
  interval,
  map,
  merge,
  of,
  startWith,
  take,
  tap
} from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { radiansToDegrees } from '../../utils/math';

const RESIZE_DEBOUNCE_MS = 10;
const MOUSE_MOVE_DEBOUNCE_MS = 4;
const ANIMATION_INTERVAL_MS = 20;
const BIRD_WIDTH_DIVIDER = 10;
const MOVEMENT_SIZE = 1;

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
      defaultIfEmpty(this.getTopRightCorner())
    )
  );

  protected readonly windowSize = toSignal(this.windowSize$, {
    initialValue: this.getCurrentWindowSize()
  });

  protected readonly mousePosition = toSignal(this.mousePosition$, {
    initialValue: this.getTopRightCorner()
  });

  protected readonly birdPosition = signal(this.getInitBirdPosition());

  protected readonly birdWidth = computed(
    () => this.windowSize()[0] / BIRD_WIDTH_DIVIDER
  );

  // TODO remove
  protected readonly angle = signal(0);
  protected readonly sector = signal(1);

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

        let alphaAngle = radiansToDegrees(Math.asin(yDistance / distance));
        let sector = 1; // TODO needed?

        // TODO calculate next position based on angle
        if (mouseX <= birdX && mouseY <= birdY) {
          sector = 2;
          alphaAngle = 180 - alphaAngle;
        } else if (mouseX <= birdX && mouseY >= birdY) {
          sector = 3;
          alphaAngle = 180 + alphaAngle;
        } else if (mouseX >= birdX && mouseY >= birdY) {
          sector = 4;
          alphaAngle = 360 - alphaAngle;
        }

        this.angle.set(alphaAngle);
        this.sector.set(sector);
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
}
