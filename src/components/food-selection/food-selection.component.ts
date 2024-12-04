import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';
import { FoodImage } from '../../types';

@Component({
  selector: 'app-food-selection',
  imports: [],
  templateUrl: './food-selection.component.html',
  styleUrl: './food-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodSelectionComponent {
  readonly foodList = input.required<FoodImage[]>();

  protected readonly foodSelected = output<FoodImage>();
}
