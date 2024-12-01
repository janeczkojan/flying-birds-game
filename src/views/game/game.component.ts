import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
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
  map,
  of,
  startWith
} from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

const RESIZE_DEBOUNCE_MS = 10;
const MOUSE_MOVE_DEBOUNCE_MS = 4;
const BIRD_WIDTH_DIVIDER = 10;

@Component({
  selector: 'app-game',
  imports: [FlyingAreaComponent, BirdComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent {
  private windowSize$ = combineLatest([
    of(null),
    fromEvent(window, 'resize').pipe(debounceTime(RESIZE_DEBOUNCE_MS))
  ]).pipe(
    startWith(this.getCurrentWindowSize()),
    map(() => this.getCurrentWindowSize())
  );

  private mousePosition$ = fromEvent(document, 'mousemove').pipe(
    debounceTime(MOUSE_MOVE_DEBOUNCE_MS),
    map((event) => event as MouseEvent),
    map((event): Position => [event.clientX, event.clientY]),
    catchError(() => of(null)),
    filter((value) => !!value),
    defaultIfEmpty(this.getTopRightCorner())
  );

  protected readonly windowSize = toSignal(this.windowSize$, {
    initialValue: this.getCurrentWindowSize()
  });

  protected readonly mousePosition = toSignal(this.mousePosition$, {
    initialValue: this.getTopRightCorner()
  });

  // TODO calculate proper position - not computed, change to WritableSignal
  // Change position over time based on angle of mouse related to current position
  protected readonly birdPosition = computed(() => this.mousePosition());

  protected readonly birdWidth = computed(
    () => this.windowSize()[0] / BIRD_WIDTH_DIVIDER
  );

  private getCurrentWindowSize(): Size {
    return [window.innerWidth, window.innerHeight];
  }

  private getTopRightCorner(): Position {
    return [this.getCurrentWindowSize()[0], 0];
  }
}
