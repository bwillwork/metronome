
export type TimeSignature = {
  beatsPerMeasure: number,
  noteGettingTheBeat: number
};

export type MetronomeConfig = {
  signature: TimeSignature,
  beatsPerMinute: number
}

export function buildDefaultConfig(): MetronomeConfig {
  return {
    beatsPerMinute: 60,
    signature: {
      beatsPerMeasure: 4,
      noteGettingTheBeat: 4,
    },
  };
}
