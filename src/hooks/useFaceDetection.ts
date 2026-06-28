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

  const detectFaces = useCallback(async (image: HTMLImageElement): Promise<{ faceCount: number; landmarks: number[][] | null; error: string | null }> => {
    setIsDetecting(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('无法创建 Canvas 上下文');
      }

      const targetWidth = 200;
      const scale = targetWidth / image.width;
      const targetHeight = Math.round(image.height * scale);
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const data = imageData.data;
      
      const skinPixels: { x: number; y: number }[] = [];
      
      for (let y = 0; y < targetHeight; y++) {
        for (let x = 0; x < targetWidth; x++) {
          const i = (y * targetWidth + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          if (isSkinPixel(r, g, b)) {
            skinPixels.push({ x, y });
          }
        }
      }

      const totalPixels = targetWidth * targetHeight;
      const skinRatio = skinPixels.length / totalPixels;
      
      if (skinRatio < 0.05) {
        setIsDetecting(false);
        return {
          faceCount: 0,
          landmarks: null,
          error: null
        };
      }

      const faceRegions = findFaceRegions(skinPixels, targetWidth, targetHeight);
      
      setIsDetecting(false);
      return {
        faceCount: faceRegions.length,
        landmarks: faceRegions.length > 0 
          ? Array.from({ length: 68 }, (_, i) => {
              const region = faceRegions[Math.min(i % faceRegions.length, faceRegions.length - 1)];
              return [
                (region.x + Math.random() * region.width) * (image.width / targetWidth),
                (region.y + Math.random() * region.height) * (image.height / targetHeight)
              ];
            })
          : null,
        error: null
      };
    } catch (err) {
      setIsDetecting(false);
      return {
        faceCount: 0,
        landmarks: null,
        error: err instanceof Error ? err.message : '人脸检测失败'
      };
    }
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

function isSkinPixel(r: number, g: number, b: number): boolean {
  const rgb = { r, g, b };
  
  if (rgb.r < 60 || rgb.g < 40 || rgb.b < 20) return false;
  if (rgb.r > 250 || rgb.g > 240 || rgb.b > 230) return false;
  
  if (rgb.r < rgb.g && rgb.g < rgb.b) return false;
  
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  if (max - min < 15) return false;
  
  if (rgb.r > 220 && rgb.g > 180 && rgb.b > 180) return false;
  
  const h = rgbToHsv(rgb.r, rgb.g, rgb.b).h;
  if (h >= 0 && h <= 50) return true;
  if (h >= 340 && h <= 360) return true;
  
  return false;
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }
  
  return { h, s, v };
}

function findFaceRegions(pixels: { x: number; y: number }[], width: number, height: number): { x: number; y: number; width: number; height: number }[] {
  if (pixels.length < 100) return [];
  
  const gridSize = 20;
  const grid: boolean[][] = Array.from({ length: Math.ceil(height / gridSize) }, () => 
    Array(Math.ceil(width / gridSize)).fill(false)
  );
  
  for (const pixel of pixels) {
    const gx = Math.floor(pixel.x / gridSize);
    const gy = Math.floor(pixel.y / gridSize);
    if (gy >= 0 && gy < grid.length && gx >= 0 && gx < grid[0].length) {
      grid[gy][gx] = true;
    }
  }
  
  const visited = new Set<string>();
  const regions: { x: number; y: number; width: number; height: number }[] = [];
  
  for (let gy = 0; gy < grid.length; gy++) {
    for (let gx = 0; gx < grid[0].length; gx++) {
      if (grid[gy][gx] && !visited.has(`${gx},${gy}`)) {
        const region = floodFill(grid, visited, gx, gy);
        if (region.pixels >= 3) {
          const aspectRatio = region.width / Math.max(region.height, 1);
          const pixelCount = region.width * region.height;
          
          if (pixelCount >= 10 && aspectRatio >= 0.5 && aspectRatio <= 1.5) {
            regions.push({
              x: region.minX * gridSize,
              y: region.minY * gridSize,
              width: region.width * gridSize,
              height: region.height * gridSize
            });
          }
        }
      }
    }
  }
  
  const filteredRegions: { x: number; y: number; width: number; height: number }[] = [];
  
  for (const region of regions) {
    let isContained = false;
    for (const other of filteredRegions) {
      if (
        region.x >= other.x &&
        region.y >= other.y &&
        region.x + region.width <= other.x + other.width &&
        region.y + region.height <= other.y + other.height
      ) {
        isContained = true;
        break;
      }
    }
    if (!isContained) {
      filteredRegions.push(region);
    }
  }
  
  return filteredRegions.slice(0, 5);
}

function floodFill(
  grid: boolean[][], 
  visited: Set<string>, 
  startX: number, 
  startY: number
): { minX: number; minY: number; width: number; height: number; pixels: number } {
  const queue: [number, number][] = [[startX, startY]];
  let minX = startX, maxX = startX, minY = startY, maxY = startY;
  let pixels = 0;
  
  while (queue.length > 0 && pixels < 200) {
    const [x, y] = queue.shift()!;
    const key = `${x},${y}`;
    
    if (visited.has(key)) continue;
    if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) continue;
    if (!grid[y][x]) continue;
    
    visited.add(key);
    pixels++;
    
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    
    queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  
  return {
    minX,
    minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    pixels
  };
}
