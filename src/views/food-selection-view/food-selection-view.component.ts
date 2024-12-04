import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FoodSelectionComponent } from '../../components/food-selection/food-selection.component';
import { FOOD_IMAGES } from '../../config/food-images';
import { GameStateService } from '../../services/game-state.service';
import { Router } from '@angular/router';
import { FoodImage } from '../../types';

@Component({
  selector: 'app-food-selection-view',
  imports: [FoodSelectionComponent],
  templateUrl: './food-selection-view.component.html',
  styleUrl: './food-selection-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodSelectionViewComponent {
  protected readonly foodToSelect = signal(Object.values(FOOD_IMAGES));

  constructor(
    private readonly gameStateService: GameStateService,
    private readonly router: Router
  ) {}

  selectFood(food: FoodImage): void {
    this.gameStateService.selectFood(food);
    void this.router.navigateByUrl('/game');
  }
}
