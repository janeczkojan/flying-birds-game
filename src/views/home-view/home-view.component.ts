import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { ROUTE_URLS } from '../../config/route-urls';

@Component({
  selector: 'app-home-view',
  imports: [ButtonComponent],
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeViewComponent {
  constructor(
    protected readonly gameStateService: GameStateService,
    private readonly router: Router
  ) {}

  start(): void {
    this.gameStateService.startInitProcess();
    void this.router.navigateByUrl(`/${ROUTE_URLS.birdSelection()}`);
  }
}
