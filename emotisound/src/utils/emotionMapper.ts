import type { Emotion } from "../types";

// Emotion to frequency mapping
export const EMOTION_FREQUENCIES: Record<Emotion, number> = {
  happy: 440, // A4 - Bright, uplifting
  sad: 220, // A3 - Deep, melancholic
  angry: 330, // E4 - Sharp, dissonant
  neutral: 261.63, // C4 - Pure, steady
};

// Emotion to color mapping
export const EMOTION_COLORS: Record<Emotion, string> = {
  happy: "#FFD700", // Gold/Yellow
  sad: "#4169E1", // Royal Blue
  angry: "#DC143C", // Crimson Red
  neutral: "#808080", // Gray
};

// Emotion to display name
export const EMOTION_LABELS: Record<Emotion, string> = {
  happy: "Happy 😊",
  sad: "Sad 😢",
  angry: "Angry 😠",
  neutral: "Neutral 😐",
};

// face-api.js emotion to our emotions (maps 7 emotions to 4 basic ones)
export const EMOTION_MAPPING: Record<string, Emotion> = {
  happy: "happy",
  sad: "sad",
  angry: "angry",
  fearful: "sad",
  disgusted: "angry",
  surprised: "happy",
  neutral: "neutral",
};

// Get average emotion from detected expressions
export function mapDetectedEmotions(expressions: Record<string, number>): {
  emotion: Emotion;
  confidence: number;
} {
  // Filter expressions and normalize
  const mappedEmotions: Record<Emotion, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    neutral: 0,
  };

  for (const [detectedEmotion, confidence] of Object.entries(expressions)) {
    const mapped = EMOTION_MAPPING[detectedEmotion];
    if (mapped) {
      mappedEmotions[mapped] += confidence;
    }
  }

  // Find emotion with highest confidence
  const emotion = Object.entries(mappedEmotions).reduce((a, b) =>
    a[1] > b[1] ? a : b,
  )[0] as Emotion;

  return {
    emotion,
    confidence: mappedEmotions[emotion],
  };
}

// Smooth confidence transitions (debounce rapid changes)
export function smoothConfidence(
  currentConfidence: number,
  newConfidence: number,
  alpha: number = 0.3,
): number {
  return currentConfidence * (1 - alpha) + newConfidence * alpha;
}
