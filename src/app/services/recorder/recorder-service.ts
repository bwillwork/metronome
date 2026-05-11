import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { NAVIGATOR, WINDOW } from '../../util/tokens';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { falseFunc, trueFunc } from '../../util/signals';

@Injectable({
  providedIn: 'root',
})
export class RecorderService {
  //private needsInit: WritableSignal<boolean> = signal(true);
  private navigator: Navigator = inject(NAVIGATOR);
  private isReady: WritableSignal<boolean> = signal(false);
  private isReady$: Observable<boolean> = toObservable(this.isReady);

  private recording: WritableSignal<boolean> = signal(false);
  private recording$: Observable<boolean> = toObservable(this.recording);
  private constraints: MediaStreamConstraints = { audio: true };
  private mediaRecorder?: MediaRecorder;
  private chunks: Array<Blob> = [];

  init() {
    if (this.isReady()) return;
    console.log('----------------------------> init recording device');
    const onStop = (e: Event) => {
      this.recording.update(falseFunc);
    };
    const onDataAvailable = (e: BlobEvent) => {
      this.chunks.push(e.data);
    };

    this.navigator.mediaDevices.getUserMedia(this.constraints).then((stream: MediaStream) => {
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.onstop = onStop;
      this.mediaRecorder.ondataavailable = onDataAvailable;

      this.isReady.update(trueFunc);
    }, console.error);
  }

  record() {
    let success = false;
    if (this.isReady() && !this.recording() && this.mediaRecorder) {
      this.mediaRecorder.start();
      this.recording.update(trueFunc);
      success = true;
    } else {
      this.error();
    }
    return success;
  }

  stop() {
    let success = false;
    if (this.isReady() && this.recording() && this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.recording.update(falseFunc);
      success = true;
    } else {
      this.error();
    }
    return success;
  }

  stopAndCleanUp() {
    if (this.isReady() && this.recording() && this.mediaRecorder) {
      console.log('-------------====> cool bro');
      this.mediaRecorder.stop();
      this.resetAudioData();
      this.recording.update(falseFunc);
    }
  }

  getAudioData() {
    if (this.mediaRecorder) {
      const blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });
      this.resetAudioData();
      return {
        audioURL: URL.createObjectURL(blob),
      };
    }
    return { audioURL: '' };
  }

  resetAudioData() {
    this.chunks = [];
  }

  subscribeIsReady(callback: (value: boolean) => void): Subscription {
    return this.isReady$.subscribe(callback);
  }

  subscribeToRecording(callback: (value: boolean) => void): Subscription {
    return this.recording$.subscribe(callback);
  }

  private error() {
    console.error('The recorder needs to be initialized');
  }
}
