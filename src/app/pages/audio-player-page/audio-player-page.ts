import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AudioFileService } from '../../services/audio-file/audio-file-service';
import { AudioUpload } from '../../types/audio-files';
import { log } from '../../util/logger';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { AudioPlayer } from '../../components/audio-player/audio-player';

@Component({
  selector: 'app-audio-player-page',
  imports: [NgClass, AudioPlayer],
  templateUrl: './audio-player-page.html',
  styleUrl: './audio-player-page.css',
})
export class AudioPlayerPage {
  private audioFileService: AudioFileService = inject(AudioFileService);
  private subs: Array<Subscription> = [];
  playlist: WritableSignal<Array<AudioUpload>> = signal([]);
  currentlyPlaying: WritableSignal<AudioUpload | undefined> = signal(undefined);

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
      const isCurrentFile = this.areEqual(upload, this.currentlyPlaying());
      if (isCurrentFile) this.currentlyPlaying.update(() => undefined);
      URL.revokeObjectURL(upload.audioURL);
      this.audioFileService.removeUpload(upload);
    }
  }
  play(upload: AudioUpload) {
    this.currentlyPlaying.update(() => upload)
    this.audioFileService.markUploadAsPlaying(upload);
  }
  pause() {}
  stop(upload: AudioUpload) {
    this.audioFileService.markUploadAsNotPlaying(upload);
  }

  private areEqual(upload: AudioUpload | undefined, other: AudioUpload | undefined) {
    if(upload && other) {
      return upload.filename === other?.filename && upload.audioURL === other.audioURL;
    }
    return false;
  }
}
