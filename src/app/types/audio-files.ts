import { SafeResourceUrl } from '@angular/platform-browser';

export type Recording = {
  filename: string,
  audioURL: SafeResourceUrl
};

export type AudioUpload = {
  filename: string,
  path: string,
};

