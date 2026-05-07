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
import { SafeResourceUrl } from '@angular/platform-browser';
import { SafePipe } from '../../pipes/safe-pipe';

@Component({
  selector: 'app-recorder-page',
  imports: [NgClass, RecordingModal, SafePipe],
  templateUrl: './recorder-page.html',
  styleUrl: './recorder-page.css',
})
export class RecorderPage implements AfterViewInit {
  @ViewChild('visualizer')
  public visualizerRef!: ElementRef<HTMLCanvasElement>;

  recording: WritableSignal<boolean> = signal(false);
  ready: WritableSignal<boolean> = signal(false);
  openModal: WritableSignal<boolean> = signal(false);

  audioFiles: WritableSignal<Array<{ filename: string; audioURL: SafeResourceUrl }>> = signal([]);

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
        if (!isRecording && this.ready()) {
          console.log('open modal');
          this.openModal.update(() => true);
        } else {
          this.openModal.update(() => false);
        }
      }),
    );
  }

  protected onSubmit(e: any) {
    const { filename } = e;
    const { audioURL } = this.recorderService.getAudioData();
    console.log({ audioURL, filename });

    const current = this.audioFiles();
    this.audioFiles.update(() => [{ audioURL, filename }, ...current]);

    console.log(this.audioFiles);
  }

  protected stop() {
    console.log('stop');
    if (!this.ready()) return;
    this.recorderService.stop();
  }

  protected record() {
    if (!this.ready()) return;
    this.recorderService.record();
  }

  private closeModal() {}

  private success(stream: MediaStream) {}
  private error() {}
}
