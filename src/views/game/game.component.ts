import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FlyingAreaComponent } from '../../components/flying-area/flying-area.component';
import { BirdComponent } from '../../components/bird/bird.component';
import { Position, Size } from '../../types';
import {
  combineLatest,
  debounceTime,
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
    startWith(this.getTopRightCorner()),
    debounceTime(MOUSE_MOVE_DEBOUNCE_MS),
    map((event) => event as MouseEvent),
    map((event): Position => [event.clientX, event.clientY])
  );

  protected readonly windowSize = toSignal(this.windowSize$, {
    initialValue: this.getCurrentWindowSize()
  });

  protected readonly mousePosition = toSignal(this.mousePosition$, {
    initialValue: this.getTopRightCorner()
  });

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
