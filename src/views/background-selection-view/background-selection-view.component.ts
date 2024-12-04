import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BACKGROUND_IMAGES } from '../../config/background-images';
import { GameStateService } from '../../services/game-state.service';
import { Router } from '@angular/router';
import { BackgroundImage } from '../../types';
import { BackgroundSelectionComponent } from '../../components/background-selection/background-selection.component';

@Component({
  selector: 'app-background-selection-view',
  imports: [BackgroundSelectionComponent],
  templateUrl: './background-selection-view.component.html',
  styleUrl: './background-selection-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackgroundSelectionViewComponent {
  protected readonly backgroundsToSelect = signal(
    Object.values(BACKGROUND_IMAGES)
  );

  constructor(
    private readonly gameStateService: GameStateService,
    private readonly router: Router
  ) {}

  selectBackground(background: BackgroundImage): void {
    this.gameStateService.selectBackground(background);
    void this.router.navigateByUrl('/game');
  }
}
