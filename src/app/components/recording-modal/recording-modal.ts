import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  InputSignal, output,
  ViewChild,
} from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-recording-modal',
  imports: [],
  templateUrl: './recording-modal.html',
  styleUrl: './recording-modal.css',
})
export class RecordingModal implements AfterViewInit {
  @ViewChild('myModal') modalElement!: ElementRef;
  private modalInstance: any;

  open: InputSignal<boolean> = input(false);

  data = output();

  constructor() {
    effect(() => {
      const shouldOpen = this.open();

      if(shouldOpen && this.modalInstance) this.modalInstance.show();
      else this.modalInstance.hide();

    });
  }

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  onSubmit() {

  }


}
