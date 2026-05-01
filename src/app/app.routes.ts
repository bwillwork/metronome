import { Routes } from '@angular/router';
import { TunerPage } from './pages/tuner-page/tuner-page';
import { MetronomePage } from './pages/metronome-page/metronome-page';
import { AudioPlayerPage } from './pages/audio-player-page/audio-player-page';

export const routes: Routes = [
  { path: 'metronome', component: MetronomePage },
  { path: 'tuner', component: TunerPage },
  { path: 'audio', component: AudioPlayerPage },
  { path: '**', redirectTo: '/metronome'}
];
