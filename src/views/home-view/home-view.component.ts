import { Component } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-view',
  imports: [],
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.scss'
})
export class HomeViewComponent {
  constructor(
    protected readonly gameStateService: GameStateService,
    private readonly router: Router
  ) {}

  start(): void {
    this.gameStateService.startInitProcess();
    void this.router.navigateByUrl('/bird-selection');
  }
}
