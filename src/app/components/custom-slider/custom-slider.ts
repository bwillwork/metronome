import { Component, input, output, signal } from '@angular/core';
import { log } from '../../util/logger';

@Component({
  selector: 'app-custom-slider',
  imports: [],
  templateUrl: './custom-slider.html',
  styleUrl: './custom-slider.css',
})
export class CustomSlider {

  value = input<number>(0);
  min = input<number>(1);
  max = input<number>(100);

  valueChange = output<number>();

  minus() {
    log(this.value());
    if (this.value() > this.min()) {
      const newValue = this.value() - 1;
      this.valueChange.emit(newValue);
    }
  }
  plus() {
    log(this.value());
    if (this.value() < this.max()) {
      const newValue = this.value() + 1;
      this.valueChange.emit(newValue);
    }
  }

  onChange(event:any) {
    const value = parseInt(event.target.value);
    this.valueChange.emit(value);
  }

}
