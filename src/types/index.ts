export interface DetectionMap {
  eyesEnlarged: boolean;
  jawNarrowed: boolean;
  skinSmooth: boolean;
  backgroundWarped: boolean;
  colorFiltered: boolean;
}

export interface AnalysisReport {
  imageUrl: string;
  processedImage: string;
  heatmapImage: string;
  totalRealityScore: number;
  skinSmoothingScore: number;
  facialWarpScore: number;
  backgroundDistortionScore: number;
  filterIntensityScore: number;
  tags: string[];
  detectionMap: DetectionMap;
}

export interface FaceDetectionResult {
  detected: boolean;
  landmarks?: number[][];
  confidence?: number;
}

export interface ImageAnalysisResult {
  skinSmoothness: number;
  facialWarp: number;
  backgroundDistortion: number;
  filterIntensity: number;
  realityScore: number;
}
