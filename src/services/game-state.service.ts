import { computed, Injectable, signal } from '@angular/core';
import { Bird } from '../types';

@Injectable()
export class GameStateService {
  private readonly _initProcessStarted = signal(false);
  private readonly _bird = signal<Bird | null>(null);

  readonly initProcessStarted = computed(() => this._initProcessStarted());
  readonly bird = computed(() => this._bird());
  readonly isBirdSelected = computed(() => !!this.bird());
  readonly isGameReady = computed(() => this.isBirdSelected());

  constructor() {}

  startInitProcess(): void {
    this._initProcessStarted.set(true);
  }

  selectBird(bird: Bird): void {
    this._bird.set(bird);
  }
}
