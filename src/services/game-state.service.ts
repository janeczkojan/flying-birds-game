import { computed, Injectable, signal } from '@angular/core';
import { BackgroundImage, Bird } from '../types';
import { BehaviorSubject, combineLatest, map, Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private readonly initProcessStartedSubject = new BehaviorSubject(false);
  private readonly birdSubject = new BehaviorSubject<Bird | null>(null);
  private readonly backgroundSubject =
    new BehaviorSubject<BackgroundImage | null>(null);

  readonly initProcessStarted$ = this.initProcessStartedSubject.asObservable();
  readonly bird$ = this.birdSubject.asObservable();
  readonly background$ = this.backgroundSubject.asObservable();
  readonly isBirdSelected$ = this.bird$.pipe(map((bird) => !!bird));

  readonly isBackgroundSelected$ = this.background$.pipe(
    map((background) => !!background)
  );

  readonly isGameReady$ = combineLatest([
    this.initProcessStarted$,
    this.isBirdSelected$,
    this.isBackgroundSelected$
  ]).pipe(map((selectedAll) => selectedAll.every((s) => !!s)));

  readonly initProcessStarted = toSignal(this.initProcessStarted$, {
    initialValue: false
  });
  readonly bird = toSignal(this.bird$, { initialValue: null });
  readonly isBirdSelected = toSignal(this.isBirdSelected$, {
    initialValue: false
  });
  readonly background = toSignal(this.background$, { initialValue: null });
  readonly isBackgroundSelected = toSignal(this.isBackgroundSelected$, {
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

  selectBackground(background: BackgroundImage): void {
    this.backgroundSubject.next(background);
  }
}
