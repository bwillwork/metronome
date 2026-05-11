import { CanDeactivateFn, Routes } from '@angular/router';
import { RecorderPage } from './pages/recorder-page/recorder-page';
import { MetronomePage } from './pages/metronome-page/metronome-page';
import { AudioPlayerPage } from './pages/audio-player-page/audio-player-page';

const unsavedChangesGuard: CanDeactivateFn<RecorderPage> = (component: RecorderPage) => {
  if (component.isRecording()) alert('You are still recording.  Please stop the recording before navigating away from this page.');
  return !component.isRecording();
};

export const routes: Routes = [
  { path: 'metronome', component: MetronomePage },
  { path: 'recorder', component: RecorderPage, canDeactivate: [unsavedChangesGuard] },
  { path: 'audio', component: AudioPlayerPage },
  { path: '**', redirectTo: '/metronome' },
];
