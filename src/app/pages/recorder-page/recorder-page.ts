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
import { BehaviorSubject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { NAVIGATOR } from '../../util/tokens';

@Component({
  selector: 'app-recorder-page',
  imports: [NgClass],
  templateUrl: './recorder-page.html',
  styleUrl: './recorder-page.css',
})
export class RecorderPage implements AfterViewInit {
  @ViewChild('visualizer')
  public visualizerRef!: ElementRef<HTMLCanvasElement>;

  private navigator: Navigator = inject(NAVIGATOR);
  private recording$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private constraints: MediaStreamConstraints = { audio: true };
  recording: Signal<boolean> = toSignal(this.recording$, { initialValue: false });
  ready: WritableSignal<boolean> = signal(false);
  showModal: WritableSignal<boolean> = signal(false);

  private mediaRecorder?: MediaRecorder;

  ngAfterViewInit(): void {
    navigator.mediaDevices.getUserMedia(this.constraints).then((stream: MediaStream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.ready.update(() => true);
    }, console.error);
  }

  protected save() {
    this.closeModal();
  }

  protected stop() {
    console.log('stop')
    if (!this.ready()) return;
    this.openModal();
  }

  protected record() {
    if (!this.ready()) return;
    if (!!this.mediaRecorder) {
      this.recording$.next(true);
      this.mediaRecorder.start();
      console.log(this.mediaRecorder.state);
      console.log('Recorder started.');
    }
  }

  private openModal() {
    this.showModal.update(() => true);
  }

  private closeModal() {
    this.showModal.update(() => false);
  }

  private success(stream: MediaStream) {}
  private error() {}
}
