import { useState, useCallback, useEffect } from 'react';
import type { FaceDetectionResult } from '../types';

export const useFaceDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [detectionResult, setDetectionResult] = useState<FaceDetectionResult | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
      setInitializing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const detectFaces = useCallback(async (_image: HTMLImageElement): Promise<{ faceCount: number; landmarks: number[][] | null; error: string | null }> => {
    setIsDetecting(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsDetecting(false);
    return {
      faceCount: 1,
      landmarks: Array.from({ length: 68 }, () => [
        Math.random() * 200 + 100,
        Math.random() * 300 + 100
      ]),
      error: null
    };
  }, []);

  const resetDetection = useCallback(() => {
    setDetectionResult(null);
  }, []);

  return {
    isDetecting,
    isInitialized,
    initializing,
    detectionResult,
    detectFaces,
    resetDetection
  };
};