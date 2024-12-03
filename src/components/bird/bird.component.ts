import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  input
} from '@angular/core';
import { Bird, BirdDirection, Position } from '../../types';

enum CssVariables {
  Width = '--width',
  PositionX = '--position-x',
  PositionY = '--position-y'
}

@Component({
  selector: 'app-bird',
  imports: [],
  templateUrl: './bird.component.html',
  styleUrl: './bird.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BirdComponent {
  readonly bird = input.required<Bird>();
  readonly width = input.required<number>();
  readonly position = input.required<Position>();
  readonly direction = input.required<BirdDirection>();

  protected readonly image = computed(() => {
    const direction = this.direction();
    const bird = this.bird();

    return direction === BirdDirection.Left ? bird.imageLeft : bird.imageRight;
  });

  @HostBinding(`style.${CssVariables.Width}`)
  protected get cssVarWidth(): string {
    return `${this.width()}px`;
  }

  @HostBinding(`style.${CssVariables.PositionX}`)
  protected get cssVarPositionX(): string {
    return `${this.position()[0]}px`;
  }

  @HostBinding(`style.${CssVariables.PositionY}`)
  protected get cssVarPositionY(): string {
    return `${this.position()[1]}px`;
  }
}
