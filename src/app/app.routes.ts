import { Routes } from '@angular/router';
import { RecorderPage } from './pages/recorder-page/recorder-page';
import { MetronomePage } from './pages/metronome-page/metronome-page';
import { AudioPlayerPage } from './pages/audio-player-page/audio-player-page';

export const routes: Routes = [
  { path: 'metronome', component: MetronomePage },
  { path: 'recorder', component: RecorderPage },
  { path: 'audio', component: AudioPlayerPage },
  { path: '**', redirectTo: '/metronome'}
];
