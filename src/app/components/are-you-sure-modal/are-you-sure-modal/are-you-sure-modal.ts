import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  InputSignal,
  output,
  ViewChild,
} from '@angular/core';
import * as bootstrap from 'bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-are-you-sure-modal',
  imports: [FormsModule],
  templateUrl: './are-you-sure-modal.html',
  styleUrl: './are-you-sure-modal.css',
})
export class AreYouSureModal implements AfterViewInit {
  @ViewChild('myModal') modalElement!: ElementRef;
  private modalInstance: any;

  open: InputSignal<boolean> = input(false);
  onSubmit = output<{ deleteRecording: boolean }>();

  constructor() {
    effect(() => {
      const shouldOpen = this.open();
      console.log('shit changed - ', shouldOpen);

      if (this.modalInstance) {
        if (shouldOpen) this.modalInstance.show();
        else this.modalInstance.hide();
      }
    });
  }

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  yes() {
    this.modalInstance.hide();
    this.onSubmit.emit({ deleteRecording: true });
  }

  no() {
    this.modalInstance.hide();
    this.onSubmit.emit({ deleteRecording: false });
  }
}
