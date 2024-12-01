import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Size } from '../../types';

@Component({
  selector: 'app-flying-area',
  imports: [],
  templateUrl: './flying-area.component.html',
  styleUrl: './flying-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlyingAreaComponent {
  // TODO add image to background

  readonly size = input.required<Size>();
}
