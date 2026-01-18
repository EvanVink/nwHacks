import React from 'react';
import type { Emotion } from '../../types';
import { EMOTION_COLORS, EMOTION_LABELS } from '../../utils/emotionMapper';

interface EmotionDisplayProps {
    emotion: Emotion | null;
    confidence: number;
}

export const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ emotion, confidence }) => {
    if (!emotion) {
        return (
            <div className="text-center py-6">
                <p className="text-gray-600">No face detected</p>
            </div>
        );
    }

    const color = EMOTION_COLORS[emotion];
    const label = EMOTION_LABELS[emotion];
    const percentage = Math.round(confidence * 100);

    return (
        <div className="flex flex-col items-center gap-4">
            <div
                className="w-24 h-24 rounded-full shadow-lg"
                style={{ backgroundColor: color }}
                role="img"
                aria-label={`${emotion} emotion detected`}
            />

            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800">{label}</h3>
                <p className="text-gray-600 mt-2">
                    Confidence: <span className="font-semibold">{percentage}%</span>
                </p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Emotion confidence level"
                />
            </div>
        </div>
    );
};