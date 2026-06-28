import type { ImageAnalysisResult, DetectionMap } from '../types';

export const analyzeImage = (): ImageAnalysisResult => {
  const skinSmoothness = Math.floor(Math.random() * 60) + 10;
  const facialWarp = Math.floor(Math.random() * 50) + 5;
  const backgroundDistortion = Math.floor(Math.random() * 40);
  const filterIntensity = Math.floor(Math.random() * 5);
  
  const realityScore = Math.max(0, 100 - skinSmoothness - facialWarp - backgroundDistortion + filterIntensity);
  
  return {
    skinSmoothness,
    facialWarp,
    backgroundDistortion,
    filterIntensity,
    realityScore: Math.min(100, Math.max(10, realityScore))
  };
};

export const generateDetectionMap = (result: ImageAnalysisResult): DetectionMap => {
  return {
    eyesEnlarged: result.facialWarp > 25,
    jawNarrowed: result.facialWarp > 30,
    skinSmooth: result.skinSmoothness > 35,
    backgroundWarped: result.backgroundDistortion > 20,
    colorFiltered: result.filterIntensity > 2
  };
};

export const generateHeatmapImage = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, 'rgba(167, 139, 250, 0.3)');
  gradient.addColorStop(0.5, 'rgba(244, 114, 182, 0.5)');
  gradient.addColorStop(1, 'rgba(245, 158, 11, 0.3)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 30 + 10;
    const alpha = Math.random() * 0.5 + 0.2;
    
    const heatGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    heatGradient.addColorStop(0, `rgba(244, 114, 182, ${alpha})`);
    heatGradient.addColorStop(1, 'rgba(244, 114, 182, 0)');
    
    ctx.fillStyle = heatGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  return canvas.toDataURL();
};

export const generateProcessedImage = (originalImage: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(originalImage);
        return;
      }
      
      ctx.filter = 'contrast(1.1) brightness(0.95) saturate(0.9)';
      ctx.drawImage(img, 0, 0);
      
      ctx.filter = 'none';
      const noise = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < noise.data.length; i += 4) {
        noise.data[i] = noise.data[i + 1] = noise.data[i + 2] = Math.random() * 10;
      }
      ctx.globalAlpha = 0.03;
      ctx.putImageData(noise, 0, 0);
      ctx.globalAlpha = 1;
      
      resolve(canvas.toDataURL());
    };
    img.onerror = () => resolve(originalImage);
    img.src = originalImage;
  });
};
