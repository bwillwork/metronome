import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private audioCtx = new AudioContext();
  private frequency: number = 800;
  private waveForm: OscillatorType = 'sine';

  playClick() {
    // Nodes
    const osc = this.audioCtx.createOscillator(); // Creates a constant tone
    const envelope = this.audioCtx.createGain();// Controlling teh Gain and overall volume

    // 2. Configure frequencies
    osc.frequency.value = this.frequency;
    osc.type = this.waveForm;

    // 3. Create a quick "decay" envelope
    const time = this.audioCtx.currentTime;// gets the ever-increasing hardware timestamp in seconds to schedule playback
    // This ramps up the volume for a very short period, simulating a click sound
    envelope.gain.setValueAtTime(1, time);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    // 4. Connect and Play
    osc.connect(envelope);
    envelope.connect(this.audioCtx.destination);

    // Plays the sound over the short period
    osc.start(time);
    osc.stop(time + 0.05); // Stop after 50ms
  }
}
