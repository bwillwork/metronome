import { Component, input, InputSignal } from '@angular/core';
import { AudioUpload } from '../../types/audio-files';

@Component({
  selector: 'app-audio-player',
  imports: [],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.css',
})
export class AudioPlayer {
  audioUpload: InputSignal<AudioUpload | undefined> = input<AudioUpload | undefined>();
}
