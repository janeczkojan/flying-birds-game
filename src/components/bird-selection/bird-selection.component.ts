import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';
import { Bird } from '../../types';

@Component({
  selector: 'app-bird-selection',
  imports: [],
  templateUrl: './bird-selection.component.html',
  styleUrl: './bird-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BirdSelectionComponent {
  readonly birds = input.required<Bird[]>();

  protected readonly birdSelected = output<Bird>();
}
