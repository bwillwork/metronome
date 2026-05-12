import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AudioFileService } from '../../services/audio-file/audio-file-service';
import { AudioUpload } from '../../types/audio-files';
import { log } from '../../util/logger';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-audio-player-page',
  imports: [NgClass],
  templateUrl: './audio-player-page.html',
  styleUrl: './audio-player-page.css',
})
export class AudioPlayerPage {
  private audioFileService: AudioFileService = inject(AudioFileService);
  private subs: Array<Subscription> = [];
  playlist: WritableSignal<Array<AudioUpload>> = signal([]);

  constructor() {
    this.subs.push(
      this.audioFileService.subscribeToUploadChanges((uploads: Array<AudioUpload>) => {
        this.playlist.update(() => uploads);
      }),
    );
  }

  uploadFiles(event: any) {
    for (let f of event.target.files) {
      log('f -> ', f, f.name);
      const filename = f.name;
      const audioURL = URL.createObjectURL(f);
      this.audioFileService.addUpload({ filename, audioURL, isPlaying: false });
    }
  }
  removeFromPlaylist(upload: AudioUpload) {
    const confirmed = confirm(
      `Are you sure that you want to remove this upload? (${upload.filename})`,
    );
    if (confirmed) {
      URL.revokeObjectURL(upload.audioURL);
      this.audioFileService.removeUpload(upload);
    }
  }
  play(upload: AudioUpload) {
    this.audioFileService.markUploadAsPlaying(upload);
  }
  pause() {}
  stop(upload: AudioUpload) {
    this.audioFileService.markUploadAsNotPlaying(upload);
  }
}
