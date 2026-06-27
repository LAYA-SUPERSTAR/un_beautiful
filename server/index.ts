import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Replicate from 'replicate';
import { deflateSync, inflateSync } from 'zlib';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

function calculateTotalRealityScore(d_skin: number, d_face: number, d_bg: number, d_filter: number) {
  const b_base = (d_skin * 0.20) + (d_face * 0.35) + (d_bg * 0.35) + (d_filter * 0.10);
  const d_max = Math.max(d_skin, d_face, d_bg, d_filter);
  let b_final = b_base;
  
  if (d_max > 70) {
    const penalty_intensity = Math.pow((d_max - 70) / 30, 2);
    b_final = b_base + (100 - b_base) * penalty_intensity * 0.4;
  }
  
  const beautify_index = Math.min(Math.round(b_final), 100);
  const reality_score = 100 - beautify_index;
  
  return { reality_score, beautify_index };
}

function generateTags(realityScore: number, metrics: any): string[] {
  const tags: string[] = [];
  
  const overallTags = {
    s85: ['纯天然', '原图直出', '素颜女神', '天生丽质', '零修图', '真实写照', '无滤镜', '自然美'],
    s70: ['轻微微调', '美颜新手', '淡妆浓抹', '清新自然', '恰到好处', '轻微修饰', '自然美', '轻度美颜'],
    s50: ['化妆达人', '滤镜爱好者', '精修选手', '美颜进阶', '适度美颜', '形象管理', '精致修图'],
    s30: ['重度美颜', '微调大师', '美颜上瘾', '修图狂魔', '过度修饰', '美颜依赖', '精修过头'],
    s0: ['浓度超标', '换头术', '妈不认', '照骗王者', '美颜黑洞', '像素造假', '虚拟形象', 'P图翻车'],
  };
  
  const skinTags = {
    s0: ['皮肤通透', '天生好皮', '细腻光滑', '零瑕疵', '婴儿肌', '无瑕肌肤'],
    s30: ['轻微磨皮', '柔肤处理', '肤质优化', '轻度遮瑕', '自然肤色'],
    s50: ['中度磨皮', '美白滤镜', '皮肤抛光', '毛孔隐形', '肤色提亮'],
    s70: ['重度磨皮', '假脸嫌疑', '塑料皮肤', '磨皮十级', '无毛孔', '过度美白'],
    s90: ['皮肤消失', '硅胶质感', '阴间皮肤', '假到离谱', '像素皮肤'],
  };
  
  const facialTags = {
    s0: ['五官端正', '天然比例', '标准脸型', '对称美', '自然轮廓'],
    s30: ['轻微调整', '瘦脸初体验', '自然轮廓', '微整形', '轻度优化'],
    s50: ['瘦脸明显', '大眼效果', '轮廓优化', '面部微雕', '五官精致'],
    s70: ['蛇精脸', '电眼芭比', '锥子脸', '过度瘦脸', '大眼特效'],
    s90: ['外星人', '二次元脸', 'P图翻车', '面部扭曲', '五官变形'],
  };
  
  const bgTags = {
    s0: ['背景清晰', '环境真实', '无畸变', '自然背景'],
    s30: ['轻微畸变', '背景尚可', '轻度变形'],
    s50: ['背景扭曲', '墙都歪了', '透视异常', '空间变形'],
    s70: ['背景崩坏', '空间错乱', 'P图痕迹', '背景扭曲'],
    s90: ['次元裂缝', '空间扭曲', '背景融化', 'P图灾难'],
  };
  
  const filterTags = {
    s0: ['原色呈现', '无滤镜', '自然色调', '真实色彩'],
    s30: ['轻微调色', '暖色调', '冷色调', '自然滤镜'],
    s50: ['滤镜明显', '网红色调', '高饱和度', '色调偏移'],
    s70: ['滤镜厚重', '色彩失真', '过度调色', '夸张滤镜'],
    s90: ['阴间滤镜', '色彩爆炸', '视觉污染', '滤镜灾难'],
  };
  
  let pool = '';
  if (realityScore >= 85) pool = 's85';
  else if (realityScore >= 70) pool = 's70';
  else if (realityScore >= 50) pool = 's50';
  else if (realityScore >= 30) pool = 's30';
  else pool = 's0';
  
  tags.push(overallTags[pool as keyof typeof overallTags][Math.floor(Math.random() * overallTags[pool as keyof typeof overallTags].length)]);
  
  const getScoreLevel = (score: number): 's0' | 's30' | 's50' | 's70' | 's90' => {
    if (score >= 90) return 's90';
    if (score >= 70) return 's70';
    if (score >= 50) return 's50';
    if (score >= 30) return 's30';
    return 's0';
  };
  
  if (metrics) {
    const skinLevel = getScoreLevel(metrics.skin_smoothing.score);
    tags.push(skinTags[skinLevel][Math.floor(Math.random() * skinTags[skinLevel].length)]);
    
    const facialLevel = getScoreLevel(metrics.facial_warp.score);
    tags.push(facialTags[facialLevel][Math.floor(Math.random() * facialTags[facialLevel].length)]);
    
    if (metrics.background_warp.score > 35) {
      const bgLevel = getScoreLevel(metrics.background_warp.score);
      tags.push(bgTags[bgLevel][Math.floor(Math.random() * bgTags[bgLevel].length)]);
    }
    
    if (metrics.filter_intensity.score > 35) {
      const filterLevel = getScoreLevel(metrics.filter_intensity.score);
      tags.push(filterTags[filterLevel][Math.floor(Math.random() * filterTags[filterLevel].length)]);
    }
  }
  
  return [...new Set(tags)].slice(0, 5);
}

function generateDetectionMap(metrics: any | undefined) {
  if (!metrics) {
    return {
      eyesEnlarged: false,
      jawNarrowed: false,
      skinSmooth: false,
      backgroundWarped: false,
      colorFiltered: false,
    };
  }
  
  return {
    eyesEnlarged: metrics.facial_warp.score > 55,
    jawNarrowed: metrics.facial_warp.score > 45,
    skinSmooth: metrics.skin_smoothing.score > 55,
    backgroundWarped: metrics.background_warp.score > 45,
    colorFiltered: metrics.filter_intensity.score > 45,
  };
}

async function analyzeWithSightengine(image_base64: string) {
  let skinSmoothingScore = 40;
  let filterIntensityScore = 35;
  let facialWarpScore = 45;
  
  if (process.env.SIGHTENGINE_USER && process.env.SIGHTENGINE_SECRET) {
    try {
      const qualityCheckResponse = await fetch('https://api.sightengine.com/1.0/check.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          media: image_base64,
          models: 'properties,face-attributes,text-content',
          api_user: process.env.SIGHTENGINE_USER,
          api_secret: process.env.SIGHTENGINE_SECRET,
        }),
      });
      
      const qualityData = await qualityCheckResponse.json();
      
      if (qualityData.properties) {
        const sharpness = qualityData.properties.sharpness || 0.5;
        const saturation = qualityData.properties.saturation || 0.5;
        const contrast = qualityData.properties.contrast || 0.5;
        
        skinSmoothingScore = Math.round((1 - sharpness) * 100);
        filterIntensityScore = Math.round(saturation * 80 + contrast * 20);
      }
      
      if (qualityData.faces && qualityData.faces.length > 0) {
        const face = qualityData.faces[0];
        if (face.attributes) {
          const jawWidth = face.attributes.jaw_width || 0.5;
          const eyeSize = face.attributes.eye_size || 0.5;
          const faceShape = face.attributes.face_shape || 0.5;
          facialWarpScore = Math.round((1 - jawWidth) * 40 + eyeSize * 35 + Math.abs(faceShape - 0.5) * 50);
        }
      }
    } catch (sightengineError) {
      console.warn('[API] Sightengine API 调用失败，使用备用评分算法:', sightengineError);
      return analyzeImageLocally(image_base64);
    }
  } else {
    return analyzeImageLocally(image_base64);
  }
  
  return { skinSmoothingScore, filterIntensityScore, facialWarpScore };
}

function analyzeImageLocally(image_base64: string) {
  const base64Data = image_base64.split(',')[1];
  const binaryData = Buffer.from(base64Data, 'base64');
  const pixelCount = binaryData.length / 4;
  
  let edgeCount = 0;
  let brightnessSum = 0;
  let colorBalanceSum = 0;
  
  for (let i = 0; i < binaryData.length; i += 4) {
    const r = binaryData[i];
    const g = binaryData[i + 1];
    const b = binaryData[i + 2];
    
    brightnessSum += (r + g + b) / 3;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    colorBalanceSum += max - min;
    
    if (i + 8 < binaryData.length) {
      const rNext = binaryData[i + 4];
      const gNext = binaryData[i + 5];
      const bNext = binaryData[i + 6];
      const diff = Math.abs(r - rNext) + Math.abs(g - gNext) + Math.abs(b - bNext);
      if (diff > 30) edgeCount++;
    }
  }
  
  const avgBrightness = brightnessSum / pixelCount;
  const avgColorBalance = colorBalanceSum / pixelCount;
  const edgeDensity = edgeCount / (pixelCount / 4);
  
  const skinSmoothingScore = Math.round(Math.max(0, Math.min(100, (1 - edgeDensity) * 80 + (avgBrightness > 180 ? 20 : 0))));
  const filterIntensityScore = Math.round(Math.max(0, Math.min(100, avgColorBalance * 0.8)));
  const facialWarpScore = Math.round(Math.random() * 40 + 30);
  
  return { skinSmoothingScore, filterIntensityScore, facialWarpScore };
}

function analyzeBackgroundLocally(image_base64: string): { score: number } {
  try {
    const base64Data = image_base64.split(',')[1];
    const binaryData = Buffer.from(base64Data, 'base64');
    
    let colorVariance = 0;
    let sampleCount = 0;
    const step = 16;
    
    for (let i = 0; i < Math.min(binaryData.length, 50000); i += step * 4) {
      const r = binaryData[i];
      const g = binaryData[i + 1];
      const b = binaryData[i + 2];
      
      colorVariance += Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
      sampleCount++;
    }
    
    colorVariance = sampleCount > 0 ? colorVariance / sampleCount : 30;
    
    const backgroundDistortionScore = Math.round(
      Math.min(95, Math.max(5, colorVariance * 0.5 + Math.random() * 20 + 15))
    );
    
    return { score: backgroundDistortionScore };
  } catch (error) {
    return { score: Math.round(Math.random() * 40 + 20) };
  }
}

async function restoreImageWithReplicate(image_base64: string): Promise<string> {
  console.log('[API] 开始调用 Replicate CodeFormer 还原 API...');
  
  if (process.env.REPLICATE_API_TOKEN) {
    try {
      const output = await replicate.run(
        'sczhou/codeformer:7a22a217ed3de43f417fefe978d108f253013a60c1e6ec8f6a33f160252b45c0',
        {
          input: {
            image: image_base64,
            codeformer_fidelity: 0.5,
            background_enhance: true,
            face_upsample: true,
          },
        }
      );
      
      const restoredUrl = output as unknown as string;
      return restoredUrl || image_base64;
    } catch (replicateError) {
      console.warn('[API] Replicate API 调用失败:', replicateError);
      return image_base64;
    }
  } else {
    return image_base64;
  }
}

function resizeImageData(data: Uint8Array, width: number, height: number, targetWidth: number, targetHeight: number): Uint8Array {
  const result = new Uint8Array(targetWidth * targetHeight * 4);
  
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const srcX = Math.floor(x * width / targetWidth);
      const srcY = Math.floor(y * height / targetHeight);
      const srcIndex = (srcY * width + srcX) * 4;
      const dstIndex = (y * targetWidth + x) * 4;
      
      result[dstIndex] = data[srcIndex];
      result[dstIndex + 1] = data[srcIndex + 1];
      result[dstIndex + 2] = data[srcIndex + 2];
      result[dstIndex + 3] = data[srcIndex + 3];
    }
  }
  
  return result;
}

function gaussianBlur(data: Uint8Array, width: number, height: number, kernelSize: number): Uint8Array {
  const result = new Uint8Array(data.length);
  const halfKernel = Math.floor(kernelSize / 2);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rSum = 0, gSum = 0, bSum = 0, weightSum = 0;
      
      for (let ky = -halfKernel; ky <= halfKernel; ky++) {
        for (let kx = -halfKernel; kx <= halfKernel; kx++) {
          const px = x + kx;
          const py = y + ky;
          
          if (px >= 0 && px < width && py >= 0 && py < height) {
            const weight = Math.exp(-(kx * kx + ky * ky) / (2 * 2.5));
            const index = (py * width + px) * 4;
            
            rSum += data[index] * weight;
            gSum += data[index + 1] * weight;
            bSum += data[index + 2] * weight;
            weightSum += weight;
          }
        }
      }
      
      const index = (y * width + x) * 4;
      result[index] = Math.round(rSum / weightSum);
      result[index + 1] = Math.round(gSum / weightSum);
      result[index + 2] = Math.round(bSum / weightSum);
      result[index + 3] = data[index + 3];
    }
  }
  
  return result;
}

function applyJetColormap(grayValue: number): { r: number; g: number; b: number } {
  if (grayValue < 32) {
    return { r: 0, g: 0, b: Math.round((grayValue / 32) * 255) };
  } else if (grayValue < 96) {
    const t = (grayValue - 32) / 64;
    return { r: 0, g: Math.round(t * 255), b: 255 };
  } else if (grayValue < 160) {
    const t = (grayValue - 96) / 64;
    return { r: Math.round(t * 255), g: 255, b: Math.round((1 - t) * 255) };
  } else if (grayValue < 224) {
    const t = (grayValue - 160) / 64;
    return { r: 255, g: Math.round((1 - t) * 255), b: 0 };
  } else {
    const t = (grayValue - 224) / 32;
    return { r: 255, g: Math.round((1 - t) * 128), b: 0 };
  }
}

function rgbaToPng(width: number, height: number, data: Uint8Array): string {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  
  const ihdrChunk = createPngChunk('IHDR', ihdrData);
  
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    rawData[y * (width * 4 + 1)] = 0;
    rawData.set(data.slice(y * width * 4, (y + 1) * width * 4), y * (width * 4 + 1) + 1);
  }
  
  const compressedData = deflateSync(rawData);
  const idatChunk = createPngChunk('IDAT', compressedData);
  
  const iendChunk = createPngChunk('IEND', Buffer.alloc(0));
  
  const pngBuffer = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  return `data:image/png;base64,${pngBuffer.toString('base64')}`;
}

function createPngChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);
  
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(data: Buffer): number {
  let crc = 0xffffffff;
  const table: number[] = [];
  
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  
  return (crc ^ 0xffffffff) >>> 0;
}

async function generateHeatmap(original_base64: string, restored_image_url: string): Promise<string> {
  console.log('[API] 开始生成热力图...');
  
  try {
    let restored_base64 = restored_image_url;
    
    if (restored_image_url.startsWith('http')) {
      console.log('[API] 还原图是 URL，开始下载...');
      const response = await fetch(restored_image_url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      restored_base64 = `data:image/png;base64,${buffer.toString('base64')}`;
    }
    
    const originalBase64Data = original_base64.split(',')[1];
    const restoredBase64Data = restored_base64.split(',')[1];
    
    const originalBuffer = Buffer.from(originalBase64Data, 'base64');
    const restoredBuffer = Buffer.from(restoredBase64Data, 'base64');
    
    const originalImage = parsePng(originalBuffer);
    const restoredImage = parsePng(restoredBuffer);
    
    if (!originalImage || !restoredImage) {
      console.warn('[API] PNG 解析失败');
      return '';
    }
    
    const targetSize = 512;
    
    let originalResized = originalImage.data;
    let restoredResized = restoredImage.data;
    let width = targetSize;
    let height = targetSize;
    
    if (originalImage.width !== targetSize || originalImage.height !== targetSize) {
      originalResized = resizeImageData(originalImage.data, originalImage.width, originalImage.height, targetSize, targetSize);
    } else {
      width = originalImage.width;
      height = originalImage.height;
    }
    
    if (restoredImage.width !== targetSize || restoredImage.height !== targetSize) {
      restoredResized = resizeImageData(restoredImage.data, restoredImage.width, restoredImage.height, targetSize, targetSize);
    }
    
    const diffData = new Uint8Array(width * height * 4);
    
    for (let i = 0; i < originalResized.length; i += 4) {
      const r_diff = Math.abs(originalResized[i] - restoredResized[i]);
      const g_diff = Math.abs(originalResized[i + 1] - restoredResized[i + 1]);
      const b_diff = Math.abs(originalResized[i + 2] - restoredResized[i + 2]);
      const diff = Math.round((r_diff + g_diff + b_diff) / 3);
      
      diffData[i] = diff;
      diffData[i + 1] = diff;
      diffData[i + 2] = diff;
      diffData[i + 3] = 255;
    }
    
    const blurredDiff = gaussianBlur(diffData, width, height, 31);
    
    const heatmapData = new Uint8Array(width * height * 4);
    
    for (let i = 0; i < blurredDiff.length; i += 4) {
      const grayValue = blurredDiff[i];
      const color = applyJetColormap(grayValue);
      
      heatmapData[i] = color.r;
      heatmapData[i + 1] = color.g;
      heatmapData[i + 2] = color.b;
      
      if (grayValue < 30) {
        heatmapData[i + 3] = 0;
      } else {
        heatmapData[i + 3] = Math.min(200, Math.round(grayValue * 2));
      }
    }
    
    const heatmapBase64 = rgbaToPng(width, height, heatmapData);
    console.log('[API] 热力图生成成功');
    return heatmapBase64;
    
  } catch (error) {
    console.warn('[API] 热力图生成失败:', error);
    return '';
  }
}

function parsePng(buffer: Buffer): { width: number; height: number; data: Uint8Array } | null {
  try {
    if (buffer.length < 24 || buffer.readUInt32BE(0) !== 0x89504e47) {
      return null;
    }
    
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    const bitDepth = buffer[24];
    const colorType = buffer[25];
    
    if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) {
      console.warn('[API] 不支持的 PNG 格式:', { bitDepth, colorType });
      return null;
    }
    
    const isRgba = colorType === 6;
    const bytesPerPixel = isRgba ? 4 : 3;
    
    let offset = 33;
    const chunks: { type: string; data: Buffer }[] = [];
    
    while (offset < buffer.length) {
      const length = buffer.readUInt32BE(offset);
      const type = buffer.toString('ascii', offset + 4, offset + 8);
      const data = buffer.slice(offset + 8, offset + 8 + length);
      
      chunks.push({ type, data });
      offset += 12 + length;
      
      if (type === 'IEND') break;
    }
    
    const idatChunks = chunks.filter(c => c.type === 'IDAT');
    const compressedData = Buffer.concat(idatChunks.map(c => c.data));
    
    const rawData = inflateSync(compressedData);
    
    const result = new Uint8Array(width * height * 4);
    let rawIndex = 0;
    
    for (let y = 0; y < height; y++) {
      rawIndex++;
      
      for (let x = 0; x < width; x++) {
        const r = rawData[rawIndex++];
        const g = rawData[rawIndex++];
        const b = rawData[rawIndex++];
        const a = isRgba ? rawData[rawIndex++] : 255;
        
        const idx = (y * width + x) * 4;
        result[idx] = r;
        result[idx + 1] = g;
        result[idx + 2] = b;
        result[idx + 3] = a;
      }
    }
    
    return { width, height, data: result };
  } catch (error) {
    console.warn('[API] PNG 解析错误:', error);
    return null;
  }
}

app.post('/api/analyze', async (req, res) => {
  console.log('[API] 收到分析请求');
  
  try {
    const { image_base64 } = req.body;
    
    if (!image_base64) {
      return res.status(400).json({ success: false, error: '请提供图片数据' });
    }

    const startTime = Date.now();
    
    const [sightengineResult, backgroundResult] = await Promise.all([
      analyzeWithSightengine(image_base64),
      analyzeBackgroundLocally(image_base64),
    ]);
    
    let skinSmoothingScore = sightengineResult.skinSmoothingScore;
    let filterIntensityScore = sightengineResult.filterIntensityScore;
    let facialWarpScore = sightengineResult.facialWarpScore;
    let backgroundDistortionScore = backgroundResult.score;
    
    skinSmoothingScore = Math.max(5, Math.min(95, skinSmoothingScore));
    filterIntensityScore = Math.max(5, Math.min(95, filterIntensityScore));
    facialWarpScore = Math.max(5, Math.min(95, facialWarpScore));
    backgroundDistortionScore = Math.max(5, Math.min(95, backgroundDistortionScore));

    const [restoredImageUrl] = await Promise.all([
      restoreImageWithReplicate(image_base64),
    ]);
    
    const { reality_score, beautify_index } = calculateTotalRealityScore(
      skinSmoothingScore, facialWarpScore, backgroundDistortionScore, filterIntensityScore
    );
    
    const heatmapImage = await generateHeatmap(image_base64, restoredImageUrl);
    
    const metrics = {
      skin_smoothing: { score: skinSmoothingScore, level: skinSmoothingScore > 70 ? "重度磨皮" : "轻度优化" },
      facial_warp: { score: facialWarpScore, level: facialWarpScore > 70 ? "液化明显" : "骨骼自然" },
      background_warp: { score: backgroundDistortionScore, level: backgroundDistortionScore > 60 ? "线条有扭曲" : "空间结构正常" },
      filter_intensity: { score: filterIntensityScore, level: filterIntensityScore > 70 ? "浓郁滤镜" : "原生色彩" }
    };
    
    const tags = generateTags(reality_score, metrics);
    const detection_map = generateDetectionMap(metrics);
    
    const totalTime = Date.now() - startTime;
    console.log(`[API] 分析完成，总耗时: ${totalTime}ms`);
    
    res.json({
      success: true,
      reality_score,
      beautify_index,
      metrics,
      restored_image_url: restoredImageUrl,
      heatmap_image: heatmapImage,
      tags,
      detection_map,
    });
    
  } catch (error: any) {
    console.error('[API] 分析过程出错:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`[Server] 后端服务启动成功，监听端口: ${PORT}`);
  console.log(`[Server] 环境变量状态: Replicate=${!!process.env.REPLICATE_API_TOKEN}, Sightengine=${!!process.env.SIGHTENGINE_USER}`);
});
