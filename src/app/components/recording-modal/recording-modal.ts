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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recording-modal',
  imports: [FormsModule],
  templateUrl: './recording-modal.html',
  styleUrl: './recording-modal.css',
})
export class RecordingModal implements AfterViewInit {
  @ViewChild('myModal') modalElement!: ElementRef;
  private modalInstance: any;

  open: InputSignal<boolean> = input(false);
  onSubmit = output<{ filename: string }>();

  filename: string = "";

  constructor() {
    effect(() => {

      const shouldOpen = this.open();
      console.log('shit changed - ',shouldOpen);

      if (this.modalInstance) {
        if (shouldOpen) this.modalInstance.show();
        else this.modalInstance.hide();
      }

    });
  }

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  submit() {
    const filename = `${this.filename}`;
    this.filename = '';
    this.modalInstance.hide();
    this.onSubmit.emit({filename});
  }
}
