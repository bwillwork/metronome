import { Component, input, output } from '@angular/core';

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

  change = output<number>();

  minus(event:any) {
    const value = parseInt(event.target.value);
    if (value >= this.min()) {
      this.change.emit(value);
    }
  }
  plus(event:any) {
    const value = parseInt(event.target.value);
    if (value <= this.max()) {
      this.change.emit(value);
    }
  }

  onChange(event:any) {
    const value = parseInt(event.target.value);
    this.change.emit(value);
  }

}
