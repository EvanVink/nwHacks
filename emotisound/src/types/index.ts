// Emotion types
export type Emotion = 'happy' | 'sad' | 'angry' | 'neutral';

export interface EmotionDetection {
    emotion: Emotion;
    confidence: number;
    timestamp: number;
}

export interface Session {
    id?: string;
    userId: string;
    startedAt: Date;
    endedAt?: Date;
    emotionCount: Record<Emotion, number>;
}

export interface User {
    id: string;
    email: string;
    createdAt: Date;
    preferences?: UserPreferences;
}

export interface UserPreferences {
    volume: number;
    sensitivity: number;
    audioEnabled: boolean;
    cameraEnabled: boolean;
}

export interface AuthResponse {
    token: string;
    user: User;
}