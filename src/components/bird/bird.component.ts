import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input
} from '@angular/core';
import { Position } from '../../types';

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
