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
import { DOCUMENT, NgClass } from '@angular/common';
import { RecorderService } from '../../services/recorder/recorder-service';
import { Recording } from '../../types/audio-files';
import { AudioFileService } from '../../services/audio-file/audio-file-service';
import { log } from '../../util/logger';

@Component({
  selector: 'app-recorder-page',
  imports: [NgClass],
  templateUrl: './recorder-page.html',
  styleUrl: './recorder-page.css',
})
export class RecorderPage implements AfterViewInit, OnDestroy {
  @ViewChild('visualizer')
  public visualizerRef!: ElementRef<HTMLCanvasElement>;

  recording: WritableSignal<boolean> = signal(false);
  ready: WritableSignal<boolean> = signal(false);
  //openModal: WritableSignal<boolean> = signal(false);

  audioFiles: WritableSignal<Array<Recording>> = signal([]);

  private recorderService: RecorderService = inject(RecorderService);
  private audioFileService: AudioFileService = inject(AudioFileService);
  private subs: Array<Subscription> = [];

  private isInitLoad: boolean = true;
  private document: Document = inject(DOCUMENT);

  isRecording() {
    return this.recording();
  }

  ngAfterViewInit(): void {
    log(' ========= After Init');
    this.recorderService.init();
    this.subs.push(
      this.recorderService.subscribeIsReady((isReady: boolean) => {
        this.ready.update(() => isReady); // Load on init
      }),
    );
    this.subs.push(
      this.recorderService.subscribeToRecording((isRecording: boolean) => {
        if (!this.isInitLoad) {
          log('isRecording: ', isRecording);
          this.recording.update(() => isRecording);
          if (!isRecording && this.ready()) {
            log('open modal');
            //this.openModal.update(trueFunc);
            const filename = prompt('Please enter a filename.', 'unnamed') ?? 'unnamed';
            const { audioURL } = this.recorderService.getAudioData();
            log({ audioURL, filename });
            this.audioFileService.addRecording({ audioURL, filename });
          }
        } else {
          this.isInitLoad = false;
        }
      }),
    );
    this.subs.push(
      this.audioFileService.subscribeToRecordingChanges((recordings: Array<Recording>) => {
        this.audioFiles.update(() => recordings); // Load on init
      }),
    );
  }

  deleteRecording(recording: Recording) {
    const confirmed = confirm(
      `Are you sure that you want to delete this recording? (${recording.filename}.ogg)`,
    );
    if (confirmed) {
      URL.revokeObjectURL(recording.audioURL);
      this.audioFileService.removeRecording(recording);
    }
  }

  downloadRecording(recording: Recording) {
    // Create a temporary download link
    const url = recording.audioURL;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.filename}.ogg`; //'recorded_audio.webm';
    this.document.body.appendChild(a);
    a.click(); // Trigger download

    // Clean up
    this.document.body.removeChild(a);
  }

  /*
  protected onSubmit(e: any) {
    const { filename } = e;
    const { audioURL } = this.recorderService.getAudioData();
    log({ audioURL, filename });
    this.audioFileService.addRecording({ audioURL, filename });
  }
   */

  protected stop() {
    log('stop');
    if (!this.ready()) return;
    this.recorderService.stop();
  }

  protected record() {
    if (!this.ready()) return;
    this.recorderService.record();
  }

  ngOnDestroy(): void {
    log(' ========= Destroy');
    while (this.subs.length > 0) this.subs.pop()?.unsubscribe();
    this.subs = [];
    this.recorderService.stopAndCleanUp();
  }
}
