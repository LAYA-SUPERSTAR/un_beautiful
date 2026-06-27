import { useState, useCallback } from 'react';
import type { AnalysisReport, DetectionMap } from '../types';
import { analyzeImage, generateDetectionMap, generateHeatmapImage, generateProcessedImage } from '../lib/imageAnalyzer';
import { getTagsByScore } from '../config/tags';

export type { AnalysisReport };

export const useImageProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [detectionMap, setDetectionMap] = useState<DetectionMap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const processImage = useCallback(async (file: File): Promise<AnalysisReport> => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    try {
      const reader = new FileReader();
      const originalUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      setOriginalImage(originalUrl);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(20);
      
      const analysis = analyzeImage();
      setProgress(40);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(60);
      
      const detMap = generateDetectionMap(analysis);
      setDetectionMap(detMap);
      setProgress(70);
      
      const heatmapImage = generateHeatmapImage();
      setProgress(80);
      
      const procImage = await generateProcessedImage(originalUrl);
      setProcessedImage(procImage);
      setProgress(95);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const tags = getTagsByScore(analysis.realityScore);
      
      const result: AnalysisReport = {
        imageUrl: originalUrl,
        processedImage: procImage,
        heatmapImage,
        totalRealityScore: analysis.realityScore,
        skinSmoothingScore: analysis.skinSmoothness,
        facialWarpScore: analysis.facialWarp,
        backgroundDistortionScore: analysis.backgroundDistortion,
        filterIntensityScore: analysis.filterIntensity,
        tags: tags.slice(0, 5),
        detectionMap: detMap
      };
      
      setReport(result);
      setProgress(100);
      setIsProcessing(false);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理图像时发生错误');
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setReport(null);
    setOriginalImage(null);
    setProcessedImage(null);
    setDetectionMap(null);
    setError(null);
    setProgress(0);
  }, []);

  return {
    isProcessing,
    report,
    originalImage,
    processedImage,
    detectionMap,
    error,
    progress,
    processImage,
    reset
  };
};