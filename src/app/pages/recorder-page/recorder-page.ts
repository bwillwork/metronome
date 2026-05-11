import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { RecordingModal } from '../../components/recording-modal/recording-modal';
import { RecorderService } from '../../services/recorder/recorder-service';
import { Recording } from '../../types/audio-files';
import { AudioFileService } from '../../services/audio-file/audio-file-service';

@Component({
  selector: 'app-recorder-page',
  imports: [NgClass, RecordingModal],
  templateUrl: './recorder-page.html',
  styleUrl: './recorder-page.css',
})
export class RecorderPage implements AfterViewInit, OnDestroy {
  @ViewChild('visualizer')
  public visualizerRef!: ElementRef<HTMLCanvasElement>;

  recording: WritableSignal<boolean> = signal(false);
  ready: WritableSignal<boolean> = signal(false);
  openModal: WritableSignal<boolean> = signal(false);

  audioFiles: WritableSignal<Array<Recording>> = signal([]);

  private recorderService: RecorderService = inject(RecorderService);
  private audioFileService: AudioFileService = inject(AudioFileService);
  private subs: Array<Subscription> = [];

  private isInitLoad: boolean = true;

  ngAfterViewInit(): void {
    this.recorderService.init();
    this.subs.push(
      this.recorderService.subscribeIsReady((isReady: boolean) => {
        this.ready.update(() => isReady);
      }),
    );
    this.subs.push(
      this.recorderService.subscribeToRecording((isRecording: boolean) => {
        if(!this.isInitLoad) {
          console.log('isRecording: ', isRecording);
          this.recording.update(() => isRecording);
          if (!isRecording && this.ready()) {
            console.log('open modal');
            this.openModal.update(() => true);
          } else {
            this.openModal.update(() => false);
          }
        } else {
          this.isInitLoad = false;
        }
      }),
    );
    this.subs.push(
      this.audioFileService.subscribeToRecordingChanges((recordings: Array<Recording>) => {
        this.audioFiles.update(() => recordings);// Load on init
      }),
    );
  }

  protected onSubmit(e: any) {
    const { filename } = e;
    const { audioURL } = this.recorderService.getAudioData();
    console.log({ audioURL, filename });
    this.audioFileService.addRecording({ audioURL, filename });
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
  ngOnDestroy(): void {
    this.recorderService.stopAndNoStateChange();
    while (this.subs.length > 0) this.subs.pop()?.unsubscribe();
    this.subs = [];
  }
}
