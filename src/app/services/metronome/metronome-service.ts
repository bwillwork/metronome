import { Injectable, Signal } from '@angular/core';
import { BehaviorSubject, interval, NEVER, Observable, Subscription, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { buildDefaultConfig, MetronomeConfig } from '../../types/metronome';

@Injectable({
  providedIn: 'root',
})
export class MetronomeService {
  private config: MetronomeConfig = buildDefaultConfig();
  private started$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private metronome$: Observable<number> = this.started$.pipe(
    switchMap((value) => {
      const milliseconds = this.getMilliseconds(this.config);
      return value ? interval(milliseconds) : NEVER;
    }),
  );
  private counter: Signal<number> = toSignal(this.metronome$, { initialValue: 0 });

  configure(config: MetronomeConfig) {
    this.config = { ...config, signature: { ...config.signature } };
  }

  getCurrentConfiguration() {
    return { ...this.config, signature: { ...this.config.signature } };
  }

  start() {
    this.started$.next(true);
  }

  pause() {

  }

  stop() {
    this.started$.next(false);
  }

  getCounter(): Signal<number> {
    return this.counter;
  }

  subscribe(callback: (num: number) => void): Subscription {
    return this.metronome$.subscribe(callback);
  }

  private getMilliseconds(config: MetronomeConfig) {
    const milliseconds = 1000;
    const secondsPerMinute = 60;
    return (secondsPerMinute / config.beatsPerMinute) * milliseconds;
  }
}
