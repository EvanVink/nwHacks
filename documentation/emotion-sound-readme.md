# EmotiSound 🎵♿

**Translating Emotions into Sound: An Accessibility Innovation**

## 🎯 Purpose

EmotiSound is an accessibility tool that translates facial expression cues into non-verbal sensory feedback (sound and color), allowing users to perceive emotional context without relying on visual interpretation. By converting emotions into auditory and visual frequencies, we create a "sixth sense" for understanding human emotion.

## 👥 Target Audience

- **Blind and low-vision users** - Experience emotions through sound rather than sight
- **Autistic individuals** - Process emotional cues through alternative sensory channels
- **Neurodivergent people** - Access emotional information in formats that work better for their cognitive processing
- **Anyone who struggles with facial expression recognition**

## 💡 Use Cases

1. **Real-time conversations** - Understand the emotional tone of people you're speaking with
2. **Video calls** - Get emotional context during remote meetings
3. **Social situations** - Navigate social interactions with enhanced emotional awareness
4. **Therapeutic settings** - Learn to recognize and process emotions in a multimodal way
5. **Educational environments** - Help neurodivergent students understand peer emotions

## 🛠️ Tech Stack

### Frontend
- **React** (v18+) - UI framework
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Styling and responsive design

### Machine Learning
- **face-api.js** (v0.22.2) - Face detection and emotion recognition
  - Pre-trained models for face detection
  - Emotion classification (7 emotions, we'll use 4)
  - Runs entirely in browser (client-side)

### Audio Synthesis
- **Tone.js** (v14+) - Web Audio API wrapper for sound generation
  - Real-time frequency synthesis
  - Audio effects and modulation
  - Precise timing and scheduling

### Authentication & Backend
- **Supabase** - Backend-as-a-Service
  - User authentication (email/password, OAuth)
  - PostgreSQL database for user profiles
  - Real-time subscriptions for analytics

### Data Analytics
- **Snowflake API** (optional) - Mood frequency analytics
  - Historical emotion tracking
  - Trend analysis over time
  - Exportable reports

### Additional Libraries
- **lucide-react** - Icons
- **recharts** - Data visualization for analytics

## ✨ Core Features

### 1. Authentication System
- User registration and login
- Secure session management
- User profile storage
- Privacy-focused (no video stored on servers)

### 2. Facial Expression Detection
- **Single face tracking** - Focuses on one person at a time
- **4 Basic Emotions:**
  - 😊 **Happy** - Positive, uplifting emotions
  - 😢 **Sad** - Low energy, melancholic emotions
  - 😠 **Angry** - High arousal, negative emotions
  - 😐 **Neutral** - Baseline, no strong emotion

### 3. Expression ↔ Frequency Mapping

#### Sound Mapping
- **Happy** → 440 Hz (A4) - Bright, ascending arpeggio, major chords
- **Sad** → 220 Hz (A3) - Deep, descending tone, minor chords
- **Angry** → 330 Hz (E4) - Sharp, staccato, dissonant intervals
- **Neutral** → 261.63 Hz (C4) - Pure sine wave, steady tone

#### Color Mapping (Visual Feedback)
- **Happy** → 🟡 Yellow/Gold (#FFD700) - Warm, bright
- **Sad** → 🔵 Blue (#4169E1) - Cool, calming
- **Angry** → 🔴 Red (#DC143C) - Intense, alert
- **Neutral** → ⚪ Gray (#808080) - Balanced, neutral

#### Intensity Modulation
- **Confidence level** (0-100%) → Volume/brightness
- **Emotion strength** → Amplitude and color saturation

### 4. Data Analytics
- **Mood frequency tracking** - Which emotions detected most often
- **Session history** - Duration, primary emotions per session
- **Trends over time** - Weekly/monthly emotional patterns
- **Export functionality** - Download reports (CSV/PDF)
- **Snowflake integration** (optional) - Advanced analytics and data warehousing

### 5. User Controls
- **Mute button** - Toggle audio on/off instantly
- **Video preview toggle** - Enable/disable camera preview
- **Volume slider** - Adjust audio output level
- **Sensitivity adjustment** - Fine-tune emotion detection threshold
- **Accessibility mode** - High contrast, screen reader friendly

## 📋 Step-by-Step Development Process

### Phase 1: Project Setup (Day 1)

#### 1.1 Initialize Project
```bash
# Create React app with TypeScript
npx create-react-app emotisound --template typescript
cd emotisound

# Install dependencies
npm install @tensorflow/tfjs face-api.js tone
npm install @supabase/supabase-js
npm install lucide-react recharts
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 1.2 Project Structure
```
emotisound/
├── public/
│   └── models/              # face-api.js models
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Camera/
│   │   │   ├── VideoPreview.tsx
│   │   │   └── FaceDetector.tsx
│   │   ├── Audio/
│   │   │   ├── EmotionSynth.tsx
│   │   │   └── AudioControls.tsx
│   │   ├── Analytics/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Charts.tsx
│   │   └── UI/
│   │       ├── ColorIndicator.tsx
│   │       └── EmotionDisplay.tsx
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── faceDetection.ts
│   │   ├── audioEngine.ts
│   │   └── analytics.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCamera.ts
│   │   └── useEmotionDetection.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── emotionMapper.ts
│   │   └── constants.ts
│   └── App.tsx
└── package.json
```

### Phase 2: Authentication (Day 2)

#### 2.1 Setup Supabase
```typescript
// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

#### 2.2 Create Authentication Components
- Login form with email/password
- Registration form
- Password reset
- OAuth providers (Google, GitHub)
- Protected routes

#### 2.3 Database Schema
```sql
-- Users table (handled by Supabase Auth)
-- User profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  preferences JSONB
);

-- Emotion sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  emotions_detected JSONB
);

-- Emotion events
CREATE TABLE emotion_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions,
  emotion TEXT,
  confidence FLOAT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### Phase 3: Face Detection (Day 3-4)

#### 3.1 Download face-api.js Models
```bash
# Download from: https://github.com/justadudewhohacks/face-api.js-models
# Place in public/models/:
# - tiny_face_detector_model-weights_manifest.json
# - face_expression_model-weights_manifest.json
```

#### 3.2 Initialize face-api.js
```typescript
// src/services/faceDetection.ts
import * as faceapi from 'face-api.js'

export async function loadModels() {
  const MODEL_URL = '/models'
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
}

export async function detectEmotions(video: HTMLVideoElement) {
  const detections = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions()
  
  return detections
}
```

#### 3.3 Video Stream Component
```typescript
// src/components/Camera/VideoPreview.tsx
// - Request camera permissions
// - Display video feed
// - Run detection loop (30 FPS)
// - Handle single face tracking
```

#### 3.4 Emotion Processing
```typescript
// src/utils/emotionMapper.ts
// - Map 7 emotions to 4 basic emotions
// - Calculate confidence scores
// - Smooth emotion transitions
```

### Phase 4: Audio Synthesis (Day 5-6)

#### 4.1 Setup Tone.js
```typescript
// src/services/audioEngine.ts
import * as Tone from 'tone'

export class EmotionSynth {
  private synth: Tone.PolySynth
  
  constructor() {
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination()
  }
  
  playEmotion(emotion: string, intensity: number) {
    // Map emotion to frequency and play
  }
}
```

#### 4.2 Emotion → Sound Mapping
```typescript
// Frequency mapping
const EMOTION_FREQUENCIES = {
  happy: { base: 440, pattern: 'arpeggio-up', timbre: 'bright' },
  sad: { base: 220, pattern: 'sustained', timbre: 'dark' },
  angry: { base: 330, pattern: 'staccato', timbre: 'harsh' },
  neutral: { base: 261.63, pattern: 'sine', timbre: 'pure' }
}
```

#### 4.3 Audio Controls
- Volume slider
- Mute/unmute toggle
- Audio visualization (waveform/spectrum)
- Preset sound palettes

### Phase 5: Visual Feedback (Day 7)

#### 5.1 Color Indicator Component
```typescript
// src/components/UI/ColorIndicator.tsx
// - Full-screen color overlay
// - Pulsing effect based on confidence
// - Smooth color transitions
// - Accessibility-friendly contrast
```

#### 5.2 Emotion Display
```typescript
// src/components/UI/EmotionDisplay.tsx
// - Current emotion label
// - Confidence percentage
// - Visual icon/emoji
// - Color-coded badge
```

### Phase 6: Analytics (Day 8-9)

#### 6.1 Data Collection
```typescript
// src/services/analytics.ts
// - Log emotion events to Supabase
// - Track session duration
// - Calculate emotion frequencies
// - Store user preferences
```

#### 6.2 Dashboard Components
```typescript
// src/components/Analytics/Dashboard.tsx
// - Emotion frequency pie chart
// - Timeline of emotions
// - Session history
// - Export functionality
```

#### 6.3 Snowflake Integration (Optional)
```typescript
// - Connect to Snowflake API
// - Batch upload analytics data
// - Generate advanced reports
// - Data warehousing for trends
```

### Phase 7: UI/UX Polish (Day 10)

#### 7.1 Accessibility Features
- Screen reader announcements for emotion changes
- Keyboard navigation
- High contrast mode
- Focus indicators
- ARIA labels

#### 7.2 Responsive Design
- Mobile-friendly layout
- Touch-friendly controls
- Orientation handling
- Cross-browser testing

#### 7.3 Error Handling
- Camera permission denied
- No face detected
- Multiple faces warning
- Network errors
- Model loading failures

### Phase 8: Testing & Deployment (Day 11-12)

#### 8.1 Testing
```bash
# Install testing libraries
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event

# Run tests
npm test
```

#### 8.2 Performance Optimization
- Lazy load components
- Optimize face detection frequency
- Debounce audio changes
- Memoize expensive calculations

#### 8.3 Deployment
```bash
# Build production version
npm run build

# Deploy to Vercel/Netlify
npx vercel deploy
# or
npx netlify deploy
```

## 🔐 Environment Variables

Create `.env.local`:
```bash
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_SNOWFLAKE_API_KEY=your_snowflake_key (optional)
```

## 📊 Success Metrics

- **Accuracy** - >80% emotion detection accuracy
- **Latency** - <100ms from detection to sound
- **User satisfaction** - Positive feedback from target users
- **Accessibility score** - WCAG 2.1 AA compliance
- **Performance** - 60 FPS video processing

## 🎓 Learning Resources

- [face-api.js Documentation](https://github.com/justadudewhohacks/face-api.js)
- [Tone.js Documentation](https://tonejs.github.io/)
- [Supabase Documentation](https://supabase.com/docs)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🚀 Future Enhancements

- Multi-language support
- Haptic feedback on mobile devices
- Custom emotion sound profiles
- Social features (share emotion playlists)
- Integration with screen readers
- AR glasses support
- Group emotion detection mode

## 📝 License

MIT License - Open source and accessible to all

## 🤝 Contributing

We welcome contributions from the accessibility and neurodivergent communities! Please see CONTRIBUTING.md for guidelines.

---

**Built with ❤️ for a more accessible world**