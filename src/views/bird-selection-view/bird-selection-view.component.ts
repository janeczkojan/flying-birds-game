import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { BirdSelectionComponent } from '../../components/bird-selection/bird-selection.component';
import { BIRDS } from '../../config/birds';
import { Bird } from '../../types';

@Component({
  selector: 'app-bird-selection-view',
  imports: [BirdSelectionComponent],
  templateUrl: './bird-selection-view.component.html',
  styleUrl: './bird-selection-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BirdSelectionViewComponent {
  protected birdsToSelect = signal(Object.values(BIRDS));

  constructor(
    private readonly gameStateService: GameStateService,
    private readonly router: Router
  ) {}

  selectBird(bird: Bird): void {
    this.gameStateService.selectBird(bird);
    void this.router.navigateByUrl('/background-selection');
  }
}
