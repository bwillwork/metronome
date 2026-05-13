import { SafeResourceUrl } from '@angular/platform-browser';

export type Recording = {
  filename: string,
  audioURL: string//SafeResourceUrl
};

export type AudioUpload = {
  filename: string,
  audioURL: string,
  isChosen: boolean
};

