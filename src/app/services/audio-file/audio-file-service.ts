import { Injectable, signal, WritableSignal } from '@angular/core';
import { AudioUpload, Recording } from '../../types/audio-files';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioFileService {
  private recordings: WritableSignal<Array<Recording>> = signal([]);
  private uploads: WritableSignal<Array<AudioUpload>> = signal([]);

  private recordings$: Observable<Array<Recording>> = toObservable(this.recordings);
  private uploads$: Observable<Array<AudioUpload>> = toObservable(this.uploads);

  addRecording(recording: Recording) {
    const compare = this.buildRecordingCompareFunc(recording);
    const exists = this.recordings().findIndex(compare) !== -1;
    if (!exists) this.recordings.update(() => [recording, ...this.recordings()]);
  }
  removeRecording(recording: Recording) {
    const compare = this.buildRecordingCompareFunc(recording);
    const index = this.recordings().findIndex(compare);
    if (index !== -1) {
      const result = [...this.recordings()];
      result.splice(index, 1);
      this.recordings.update(() => result);
    }
  }
  getRecordings() {
    return [...this.recordings()];
  }
  subscribeToRecordingChanges(callback: (recordings: Array<Recording>) => void) {
    return this.recordings$.subscribe(callback);
  }

  addUpload(upload: AudioUpload) {
    const compare = this.buildAudioUploadCompareFunc(upload);
    const exists = this.uploads().findIndex(compare) !== -1;
    if (!exists) this.uploads.update(() => [upload, ...this.uploads()]);
  }
  removeUpload(upload: AudioUpload) {
    const compare = this.buildAudioUploadCompareFunc(upload);
    const index = this.uploads().findIndex(compare);
    if (index !== -1) {
      const result = [...this.uploads()];
      result.splice(index, 1);
      this.uploads.update(() => result);
    }
  }
  getUploads() {
    return [this.uploads()];
  }
  subscribeToUploadChanges(callback: (recordings: Array<AudioUpload>) => void) {
    return this.uploads$.subscribe(callback);
  }

  private buildRecordingCompareFunc(recording: Recording) {
    return (r: Recording) => r.audioURL === recording.audioURL && r.filename === recording.filename;
  }

  private buildAudioUploadCompareFunc(upload: AudioUpload) {
    return (u: AudioUpload) => u.path === upload.path && u.filename === upload.filename;
  }
}
