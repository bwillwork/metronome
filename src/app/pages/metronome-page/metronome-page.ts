import { Component, inject, OnDestroy, OnInit, Signal, WritableSignal } from '@angular/core';
import { MetronomeDisplay } from '../../components/metronome-display/metronome-display';
import { MetronomeService } from '../../services/metronome/metronome-service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetronomeConfig } from '../../types/metronome';
import { SoundService } from '../../services/sound/sound-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-metronome-page',
  imports: [MetronomeDisplay, NgClass, FormsModule],
  templateUrl: './metronome-page.html',
  styleUrl: './metronome-page.css',
})
export class MetronomePage implements OnInit, OnDestroy {
  private metronomeService: MetronomeService = inject(MetronomeService);
  private soundService: SoundService = inject(SoundService);
  private subs: Array<Subscription> = [];

  //public counter: Signal<number> = this.metronomeService.getCounter();
  public running: Signal<boolean> = this.metronomeService.isRunning();
  public config: WritableSignal<MetronomeConfig> = this.metronomeService.getCurrentConfiguration();

  public minBPMinute = 1;
  public maxBPMinute = 250;

  public minBPMeasure = 1;
  public maxBPMeasure = 17;

  ngOnInit(): void {
    this.subs.push(this.metronomeService.subscribe(() => {
      this.soundService.playClick();
    }));
  }

  start() {
    this.metronomeService.start();
  }

  stop() {
    this.metronomeService.stop();
  }

  minus() {
    const current = this.config();
    if (current.beatsPerMinute > this.minBPMinute) {
      current.beatsPerMinute -= 1;
      this.metronomeService.configure(current);
    }
  }

  plus() {
    const current = this.config();
    if (current.beatsPerMinute < this.maxBPMinute) {
      current.beatsPerMinute += 1;
      this.metronomeService.configure(current);
    }
  }

  rangeChange(event: any) {
    const value = parseInt(event.target.value);
    const current = this.config();
    if (value < this.maxBPMinute && value > this.minBPMinute) {
      current.beatsPerMinute = value;
      this.metronomeService.configure(current);
    }
  }

  updateBeatsPerMeasure(event: any) {
    const value = parseInt(event.target.value);
    const current = this.config();
    if (value < this.maxBPMeasure && value > this.minBPMeasure) {
      current.signature.beatsPerMeasure = value;
      this.metronomeService.configure(current);
    }
  }

  ngOnDestroy(): void {
    while (this.subs.length > 0) this.subs.pop()?.unsubscribe();
    this.subs = [];
  }
}
