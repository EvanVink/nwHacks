import * as faceapi from "face-api.js";
import {
  FACE_DETECTION_OPTIONS,
  MODEL_URL,
  CONFIDENCE_THRESHOLD,
} from "../utils/constants";
import { mapDetectedEmotions } from "../utils/emotionMapper";
import type { Emotion } from "../types";

class FaceDetectionService {
  private modelsLoaded = false;

  async loadModels(): Promise<void> {
    if (this.modelsLoaded) return;

    try {
      let modelUrl = MODEL_URL;

      try {
        // Check if local models exist
        const response = await fetch(
          MODEL_URL + "tiny_face_detector_model-weights_manifest.json",
        );
        if (!response.ok) {
          // Use CDN if local models not found
          modelUrl =
            "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.11/model/";
        }
      } catch {
        // Use CDN if local models not found
        modelUrl =
          "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.11/model/";
      }

      // Load face detection and expression models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
        faceapi.nets.faceExpressionNet.loadFromUri(modelUrl),
      ]);
      this.modelsLoaded = true;
    } catch (error) {
      console.error("Error loading face-api models:", error);
      throw new Error(
        "Failed to load face detection models. Please refresh the page.",
      );
    }
  }

  async detectSingleFace(
    video: HTMLVideoElement,
  ): Promise<{ emotion: Emotion; confidence: number } | null> {
    if (!this.modelsLoaded) {
      throw new Error("Models not loaded. Call loadModels() first.");
    }

    try {
      // Detect single face with expressions
      const detection = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions(FACE_DETECTION_OPTIONS),
        )
        .withFaceExpressions();

      // No face detected
      if (!detection) {
        return null;
      }

      // Map detected emotions to our 4 emotions and get highest confidence
      const expressionData = Object.entries(detection.expressions).reduce(
        (acc, [key, value]) => {
          acc[key] = value as number;
          return acc;
        },
        {} as Record<string, number>,
      );
      const result = mapDetectedEmotions(expressionData);

      // Only return if confidence meets threshold
      if (result.confidence >= CONFIDENCE_THRESHOLD) {
        return result;
      }

      return null;
    } catch (error) {
      console.error("Error detecting faces:", error);
      return null;
    }
  }

  async detectFacesWithExpressions(
    video: HTMLVideoElement,
  ): Promise<Array<{ emotion: Emotion; confidence: number }>> {
    if (!this.modelsLoaded) {
      throw new Error("Models not loaded. Call loadModels() first.");
    }

    try {
      // For MVP, we only want single face detection
      const detection = await this.detectSingleFace(video);
      return detection ? [detection] : [];
    } catch (error) {
      console.error("Error detecting faces:", error);
      return [];
    }
  }

  isModelsLoaded(): boolean {
    return this.modelsLoaded;
  }
}

export default new FaceDetectionService();
