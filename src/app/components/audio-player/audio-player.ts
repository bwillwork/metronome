import {
  Component,
  computed,
  ElementRef,
  input,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { AudioUpload, Recording } from '../../types/audio-files';
import { log } from '../../util/logger';
import { falseFunc, trueFunc } from '../../util/signals';

@Component({
  selector: 'app-audio-player',
  imports: [],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.css',
})
export class AudioPlayer {
  @ViewChild('audioPlayer')
  audioRef!: ElementRef<HTMLAudioElement>;

  upload = input<AudioUpload | Recording | undefined>(undefined);
  autoPlay = input<boolean>(true);
  hasUpload = computed(() => !!this.upload());
  canPlay = computed(() => {
    return this.hasUpload() && !!this.audioRef;
  });

  private isPlaying: WritableSignal<boolean> = signal(false);

  play(event: any) {
    log('play: ', event);
  }
  playing(event: any) {
    log('playing: ', event);
    if (!this.isPlaying()) this.isPlaying.update(trueFunc);
  }
  pause(event: any) {
    log('pause: ', event);
    if (this.isPlaying()) this.isPlaying.update(falseFunc);
  }
  ended(event: any) {
    log('ended: ', event);
    if (this.isPlaying()) this.isPlaying.update(falseFunc);
  }

  loaded(event: any) {
    log('loaded: ', event, this.canPlay());
    if (this.canPlay() && this.autoPlay()) this.audioRef.nativeElement.play();
  }

  volumechange(event: any) {
    log('volumechange: ', event);
  }
}
