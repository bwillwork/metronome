import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  Signal,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, interval, NEVER, Observable, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-metronome-display',
  imports: [],
  templateUrl: './metronome-display.html',
  styleUrl: './metronome-display.css',
})
export class MetronomeDisplay implements AfterViewInit, OnDestroy {
  @ViewChild('canvas')
  public canvasRef!: ElementRef<HTMLCanvasElement>;

  public width = 400;
  public height = 400;

  public beatsPerMinute = input();

  private started$ = new BehaviorSubject(false);
  private metronome$: Observable<number> = this.started$.pipe(
    switchMap((value) => {
      const milliseconds = 1000;
      return value ? interval(milliseconds) : NEVER;
    }),
  );
  public metronome: Signal<number> = toSignal(this.metronome$, { initialValue: 0 });

  ngAfterViewInit() {
    // Access the raw DOM element
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    //console.log(rawDiv.innerHTML); // "Raw Element"
    //rawDiv.style.color = 'red'; // Direct DOM manipulation
  }

  private animationLoop() {}

  ngOnDestroy(): void {}
}
