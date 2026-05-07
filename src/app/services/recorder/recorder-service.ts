import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { NAVIGATOR, WINDOW } from '../../util/tokens';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class RecorderService {
  private window: Window = inject(WINDOW);
  private navigator: Navigator = inject(NAVIGATOR);
  private isReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isReady: Signal<boolean> = toSignal(this.isReady$, { initialValue: false });

  private recording$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private recording: Signal<boolean> = toSignal(this.recording$, { initialValue: false });
  private constraints: MediaStreamConstraints = { audio: true };
  private mediaRecorder?: MediaRecorder;
  private chunks: Array<Blob> = [];

  init() {
    if (this.isReady()) return;

    const onStop = (e: Event) => {
      this.recording$.next(false);
    };
    const onDataAvailable = (e: BlobEvent) => {
      this.chunks.push(e.data);
    };

    this.navigator.mediaDevices.getUserMedia(this.constraints).then((stream: MediaStream) => {
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.onstop = onStop;
      this.mediaRecorder.ondataavailable = onDataAvailable;

      this.isReady$.next(true);
    }, console.error);
  }

  record() {
    let success = false;
    if (this.isReady() && !this.recording() && this.mediaRecorder) {
      this.mediaRecorder.start();
      this.recording$.next(true);
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
      this.recording$.next(false);
      success = true;
    } else {
      this.error();
    }
    return success;
  }

  getAudioData() {
    if (this.mediaRecorder) {
      const blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });
      this.chunks = [];
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
