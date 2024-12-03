import { Component, output } from '@angular/core';

@Component({
  selector: 'app-welcome-screen',
  imports: [],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.scss'
})
export class WelcomeScreenComponent {
  protected readonly startClicked = output();
}
