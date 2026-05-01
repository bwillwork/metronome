import { Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { BehaviorSubject, interval, map, NEVER, Observable, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MetronomeDisplay } from '../../components/metronome-display/metronome-display';

@Component({
  selector: 'app-metronome-page',
  imports: [MetronomeDisplay],
  templateUrl: './metronome-page.html',
  styleUrl: './metronome-page.css',
})
export class MetronomePage implements OnInit, OnDestroy {
  private started$ = new BehaviorSubject(false);
  private metronome$: Observable<number> = this.started$.pipe(
    switchMap((value) => {
      const milliseconds = 1000;
      return value ? interval(milliseconds) : NEVER;
    }),
  );
  public metronome: Signal<number> = toSignal(this.metronome$, { initialValue: 0 });

  start() {
    this.started$.next(true);
  }

  stop() {
    this.started$.next(false);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
