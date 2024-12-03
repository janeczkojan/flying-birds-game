import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  input
} from '@angular/core';
import { BirdDirection, Position } from '../../types';

const RIGHT_IMAGE = '/images/birds/black_right.gif';
const LEFT_IMAGE = '/images/birds/black_left.gif';

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
  readonly width = input.required<number>();
  readonly position = input.required<Position>();
  readonly direction = input.required<BirdDirection>();

  protected readonly image = computed(() =>
    this.direction() === BirdDirection.Left ? LEFT_IMAGE : RIGHT_IMAGE
  );

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
