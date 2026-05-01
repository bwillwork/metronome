import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { MetronomeDisplay } from '../../components/metronome-display/metronome-display';
import { MetronomeService } from '../../services/metronome/metronome-service';

@Component({
  selector: 'app-metronome-page',
  imports: [MetronomeDisplay],
  templateUrl: './metronome-page.html',
  styleUrl: './metronome-page.css',
})
export class MetronomePage implements OnInit, OnDestroy {
  private metronomeService: MetronomeService = inject(MetronomeService);
  public counter: Signal<number> = this.metronomeService.getCounter();

  start() {
    this.metronomeService.start();
  }

  stop() {
    this.metronomeService.stop();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
