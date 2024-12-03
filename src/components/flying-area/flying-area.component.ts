import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';
import { Size } from '../../types';

@Component({
  selector: 'app-flying-area',
  imports: [],
  templateUrl: './flying-area.component.html',
  styleUrl: './flying-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlyingAreaComponent {
  readonly image = '/images/backgrounds/cloudy-sky.jpg';

  readonly size = input.required<Size>();

  protected readonly width = computed(() => this.size()[0]);
  protected readonly height = computed(() => this.size()[1]);
}
