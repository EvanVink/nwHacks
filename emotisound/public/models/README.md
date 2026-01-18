# Face API Models Installation

The face-api.js models are large files that need to be downloaded separately. You have two options:

## Option 1: Download Pre-built Models (Recommended)

Models can be downloaded from the official face-api.js repository:
https://github.com/justadudewhohacks/face-api.js-models

Download these files and place them in `public/models/`:

Required files:
1. `tiny_face_detector_model-weights_manifest.json`
2. `tiny_face_detector_model-weights.bin`
3. `face_expression_model-weights_manifest.json`
4. `face_expression_model-weights.bin`

## Option 2: Use CDN (Quick Start)

You can also modify `src/services/faceDetection.ts` to use CDN URLs:

```typescript
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.11/model/'
```

## Directory Structure

After downloading, your structure should be:

```
emotisound/public/models/
├── tiny_face_detector_model-weights_manifest.json
├── tiny_face_detector_model-weights.bin
├── face_expression_model-weights_manifest.json
└── face_expression_model-weights.bin
```

The app will work fine without the models initially, but facial expression detection won't function until they're in place.
