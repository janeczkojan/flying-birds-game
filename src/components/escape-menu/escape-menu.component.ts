import { Component, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-escape-menu',
  imports: [ButtonComponent],
  templateUrl: './escape-menu.component.html',
  styleUrl: './escape-menu.component.scss'
})
export class EscapeMenuComponent {
  protected readonly quitGameClick = output();
  protected readonly continueClick = output();
}
