import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Signal,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, interval, NEVER, Observable, Subscription, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MetronomeService } from '../../services/metronome/metronome-service';
import { CircleData, Point } from '../../types/canvas';

@Component({
  selector: 'app-metronome-display',
  imports: [],
  templateUrl: './metronome-display.html',
  styleUrl: './metronome-display.css',
})
export class MetronomeDisplay implements AfterViewInit, OnDestroy {
  @ViewChild('canvas')
  public canvasRef!: ElementRef<HTMLCanvasElement>;

  public length;
  public width;
  public height;

  public beatsPerMinute = input();

  private started$ = new BehaviorSubject(false);
  private metronome$: Observable<number> = this.started$.pipe(
    switchMap((value) => {
      const milliseconds = 1000;
      return value ? interval(milliseconds) : NEVER;
    }),
  );
  public metronome: Signal<number> = toSignal(this.metronome$, { initialValue: 0 });
  private ctx?: CanvasRenderingContext2D;
  private metronomeService: MetronomeService = inject(MetronomeService);
  private subs: Array<Subscription> = [];
  private config = this.metronomeService.getCurrentConfiguration();

  constructor() {
    this.length = 400;
    this.width = this.length;
    this.height = this.length;
    effect(() => {
      const current = this.config();
      if(this.ctx && current.beatsPerMinute > 0) this.draw(this.ctx, 0, true);
    });
  }

  ngAfterViewInit() {
    // Access the raw DOM element
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.subs.push(
      this.metronomeService.subscribe((count: number) => {
        if (this.ctx) this.draw(this.ctx, count, false);
      }),
    );
    this.draw(this.ctx, 0, true);
  }

  private draw(ctx: CanvasRenderingContext2D, count: number, isIdol: boolean) {
    ctx.clearRect(0, 0, this.width, this.height);

    const bpmReadout = `${this.config().beatsPerMinute} bpm`;
    const padding = 20;

    const center: Point = {
      x: this.width / 2,
      y: this.height / 2,
    };

    const mainCircle = {
      c: center,
      r: this.length / 2 - padding * 2,
      color: '#ccc',
      name: bpmReadout,
    };

    this.drawCircle(ctx, mainCircle);

    const numCircles = this.config().signature.beatsPerMeasure;
    const countMod = count % numCircles;
    for (let i = 0; i < numCircles; ++i) {
      const rads = (2 * Math.PI * i) / numCircles - 0.5 * Math.PI;
      const coords = this.radsToDegrees(rads, center, mainCircle.r);
      let color: string;
      if (isIdol) {
        color = '#fff';
      } else {
        color = i <= countMod ? 'skyblue' : '#ffffff';
      }
      const circle = {
        c: coords,
        r: 30,
        name: (i + 1).toString(),
        color,
      };
      this.drawCircle(ctx, circle);
    }
  }

  private drawCircle(ctx: CanvasRenderingContext2D, circle: CircleData) {
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;

    ctx.arc(circle.c.x, circle.c.y, circle.r, 0, (Math.PI / 180) * 360, false);
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    if (circle.name) {
      const height = 20;
      ctx.font = `${height}px serif`;
      ctx.fillStyle = '#222';
      const width = ctx.measureText(circle.name).width;
      const x = circle.c.x - width / 2;
      const y = circle.c.y + height / 2;
      ctx.fillText(circle.name, x, y);
    }
  }

  private radsToDegrees(rads: number, center: Point, radius: number) {
    //const r = rads % (Math.PI * 2);
    return {
      x: radius * Math.cos(rads) + center.x,
      y: radius * Math.sin(rads) + center.y,
    };
  }

  ngOnDestroy(): void {}
}


