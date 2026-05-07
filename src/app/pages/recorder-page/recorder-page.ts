import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  signal,
  Signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { RecordingModal } from '../../components/recording-modal/recording-modal';
import { RecorderService } from '../../services/recorder/recorder-service';

@Component({
  selector: 'app-recorder-page',
  imports: [NgClass, RecordingModal],
  templateUrl: './recorder-page.html',
  styleUrl: './recorder-page.css',
})
export class RecorderPage implements AfterViewInit {
  @ViewChild('visualizer')
  public visualizerRef!: ElementRef<HTMLCanvasElement>;

  recording: WritableSignal<boolean> = signal(false);
  ready: WritableSignal<boolean> = signal(false);

  private recorderService: RecorderService = inject(RecorderService);
  private subs: Array<Subscription> = [];

  ngAfterViewInit(): void {
    this.recorderService.init();
    this.subs.push(
      this.recorderService.subscribeIsReady((isReady: boolean) => {
        this.ready.update(() => isReady);
      }),
    );
    this.subs.push(
      this.recorderService.subscribeToRecording((isRecording: boolean) => {
        console.log('isRecording: ', isRecording);
        this.recording.update(() => isRecording);

        this.openModal();

      }),
    );
  }

  protected save() {}

  protected stop() {
    console.log('stop');
    if (!this.ready()) return;
    this.recorderService.stop();
  }

  protected record() {
    if (!this.ready()) return;
    this.recorderService.record();
  }

  private openModal() {}

  private closeModal() {}

  private success(stream: MediaStream) {}
  private error() {}
}
