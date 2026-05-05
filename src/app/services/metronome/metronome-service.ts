import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import {
  BehaviorSubject,
  interval,
  map,
  NEVER,
  Observable,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { buildDefaultConfig, MetronomeConfig } from '../../types/metronome';

@Injectable({
  providedIn: 'root',
})
export class MetronomeService {
  private config: WritableSignal<MetronomeConfig> = signal(buildDefaultConfig());
  private running$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private metronome$: Observable<number> = this.buildMetronomeObs(this.running$);
  private counter: Signal<number> = toSignal(this.metronome$, { initialValue: 0 });
  private running: Signal<boolean> = toSignal(this.running$, { initialValue: false });

  configure(config: MetronomeConfig) {
    this.config.update(() => ({ ...config, signature: { ...config.signature } }));
  }

  getCurrentConfiguration() {
    return this.config;
  }

  start() {
    this.running$.next(true);
  }

  stop() {
    this.running$.next(false);
  }

  getCounter(): Signal<number> {
    return this.counter;
  }

  subscribe(callback: (num: number) => void): Subscription {
    return this.metronome$.subscribe(callback);
  }

  isRunning(): Signal<boolean> {
    return this.running;
  }

  private getMilliseconds(config: MetronomeConfig) {
    const milliseconds = 1000;
    const secondsPerMinute = 60;
    return (secondsPerMinute / config.beatsPerMinute) * milliseconds;
  }

  private buildMetronomeObs(running$: BehaviorSubject<boolean>): Observable<number> {
    return running$.pipe(
      switchMap((value) => {
        const milliseconds = this.getMilliseconds(this.config());
        return value
          ? interval(milliseconds).pipe(
              startWith(-1),
              map((v) => v + 1),
            )
          : NEVER;
      }),
    );
  }
}
