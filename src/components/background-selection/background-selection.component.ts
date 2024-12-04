import { Component, input, output } from '@angular/core';
import { BackgroundImage } from '../../types';

@Component({
  selector: 'app-background-selection',
  imports: [],
  templateUrl: './background-selection.component.html',
  styleUrl: './background-selection.component.scss'
})
export class BackgroundSelectionComponent {
  readonly backgrounds = input.required<BackgroundImage[]>();

  protected readonly backgroundSelected = output<BackgroundImage>();
}
