import { Component, HostBinding, input } from '@angular/core';
import { FoodImage, Position } from '../../types';

enum CssVariables {
  Size = '--size',
  PositionX = '--position-x',
  PositionY = '--position-y'
}

@Component({
  selector: 'app-food',
  imports: [],
  templateUrl: './food.component.html',
  styleUrl: './food.component.scss'
})
export class FoodComponent {
  readonly food = input.required<FoodImage>();
  readonly size = input.required<number>();
  readonly position = input.required<Position>();

  @HostBinding(`style.${CssVariables.Size}`)
  protected get cssVarSize(): string {
    return `${this.size()}px`;
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
