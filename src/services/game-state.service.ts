import { computed, Injectable, signal } from '@angular/core';
import { Bird } from '../types';
import { BehaviorSubject, combineLatest, map, Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private readonly initProcessStartedSubject = new BehaviorSubject(false);
  private readonly birdSubject = new BehaviorSubject<Bird | null>(null);

  readonly initProcessStarted$ = this.initProcessStartedSubject.asObservable();
  readonly bird$ = this.birdSubject.asObservable();
  readonly isBirdSelected$ = this.bird$.pipe(map((bird) => !!bird));

  readonly isGameReady$ = combineLatest([
    this.initProcessStarted$,
    this.isBirdSelected$
  ]).pipe(map((selectedAll) => selectedAll.every((s) => !!s)));

  readonly initProcessStarted = toSignal(this.initProcessStarted$, {
    initialValue: false
  });
  readonly bird = toSignal(this.bird$, { initialValue: null });
  readonly isBirdSelected = toSignal(this.isBirdSelected$, {
    initialValue: false
  });
  readonly isGameReady = toSignal(this.isGameReady$, { initialValue: false });

  constructor() {}

  startInitProcess(): void {
    this.initProcessStartedSubject.next(true);
  }

  selectBird(bird: Bird): void {
    this.birdSubject.next(bird);
  }
}
