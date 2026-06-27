import { useState, useCallback } from 'react';
import { CyberpunkUpload } from '../components/CyberpunkUpload';
import { HeatmapOverlay } from '../components/HeatmapOverlay';
import { ReportDashboard } from '../components/ReportDashboard';
import { ErrorModal } from '../components/ErrorModal';
import { ScanningAnimation } from '../components/ScanningAnimation';
import { DataDashboard } from '../components/DataDashboard';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { useFaceDetection } from '../hooks/useFaceDetection';

import { BRAND, SCAN_STEPS } from '../config/brand';

type AppState = 'upload' | 'scanning' | 'result' | 'error';

const generateMockImage = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#2d3436';
  ctx.beginPath();
  ctx.arc(200, 220, 80, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#dfe6e9';
  ctx.beginPath();
  ctx.arc(200, 200, 70, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2d3436';
  ctx.beginPath();
  ctx.arc(170, 185, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(230, 185, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffeaa7';
  ctx.beginPath();
  ctx.arc(170, 183, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(230, 183, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#2d3436';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(200, 210, 20, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = '#fdcb6e';
  ctx.beginPath();
  ctx.arc(155, 230, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(245, 230, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fab1a0';
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.ellipse(155, 230, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(245, 230, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  return canvas.toDataURL('image/jpeg', 0.9);
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [errorMessage, setErrorMessage] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState('初始化中...');
  const [scanInterval, setScanInterval] = useState<number | null>(null);

  const { originalImage, processedImage, report, detectionMap, isProcessing, error, processImage, reset } = useImageProcessing();
  const { detectFaces, isDetecting, isInitialized, initializing } = useFaceDetection();

  const canUpload = isInitialized;

  const handleCloseError = useCallback(() => {
    setErrorMessage('');
    setAppState('upload');
  }, []);

  const handleReset = useCallback(() => {
    reset();
    setAppState('upload');
    setScanProgress(0);
    setScanStep('初始化中...');
  }, [reset]);

  const startScanAnimation = useCallback(() => {
    const steps = [
      { progress: 10, text: SCAN_STEPS[0] },
      { progress: 25, text: SCAN_STEPS[1] },
      { progress: 40, text: SCAN_STEPS[2] },
      { progress: 60, text: '正在运行 AI 还原...' },
      { progress: 80, text: '正在计算综合真实度...' },
      { progress: 95, text: SCAN_STEPS[4] },
    ];
    
    let stepIndex = 0;
    
    const interval = window.setInterval(() => {
      const step = steps[stepIndex];
      setScanProgress(step.progress);
      setScanStep(step.text);
      
      stepIndex = (stepIndex + 1) % steps.length;
      
      if (stepIndex === 0) {
        setScanProgress(0);
      }
    }, 800);
    
    setScanInterval(interval);
  }, []);

  const stopScanAnimation = useCallback(() => {
    if (scanInterval) {
      clearInterval(scanInterval);
      setScanInterval(null);
    }
    setScanProgress(100);
    setScanStep('鉴定完成！');
  }, [scanInterval]);

  const handleFileSelect = useCallback(async (file: File) => {
    if (isProcessing || isDetecting) return;
    if (!canUpload) {
      setErrorMessage('人脸检测模块正在初始化，请稍候...');
      setAppState('error');
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('文件类型错误，仅支持 JPG、JPEG、PNG 格式。');
      setAppState('error');
      return;
    }

    if (file.size > MAX_SIZE) {
      setErrorMessage('文件过大，限制在 5MB 以内。');
      setAppState('error');
      return;
    }

    setScanProgress(0);
    setScanStep('正在读取图片...');
    setAppState('scanning');
    startScanAnimation();

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      
      const img = new Image();
      img.onload = async () => {
        const detectionResult = await detectFaces(img);

        if (detectionResult.error) {
          stopScanAnimation();
          setErrorMessage(detectionResult.error);
          setAppState('error');
          return;
        }

        if (detectionResult.faceCount === 0) {
          stopScanAnimation();
          setErrorMessage('未检测到人脸，请上传包含清晰正脸的人物照片。');
          setAppState('error');
          return;
        }

        if (detectionResult.faceCount >= 2) {
          stopScanAnimation();
          setErrorMessage('为了保证分析准确度，目前仅支持单人照片，请重新上传。');
          setAppState('error');
          return;
        }

        await processImage(file);
        stopScanAnimation();
        setAppState('result');
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      stopScanAnimation();
      setErrorMessage('图片读取失败，请重新上传。');
      setAppState('error');
    };
    reader.readAsDataURL(file);
  }, [isProcessing, isDetecting, canUpload, detectFaces, processImage, startScanAnimation, stopScanAnimation]);

  const scrollToResults = useCallback(() => {
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (appState === 'scanning') {
    const displayImage = originalImage || generateMockImage();
    return <ScanningAnimation imageSrc={displayImage} progress={scanProgress} currentStep={scanStep} />;
  }

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <ErrorModal isOpen={appState === 'error'} message={errorMessage} onClose={handleCloseError} />

      <div className="relative z-10 container mx-auto px-page-margin py-4 w-full">
        <header className="text-center mb-6">
          <div className="flex flex-col items-center mb-4">
            <div className="w-12 h-0.5 bg-primary/30 rounded-full mb-5" />
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold font-display text-primary">
                {BRAND.name}
              </h1>
              <span className="text-text-muted text-lg md:text-xl">|</span>
              <span className="text-text-secondary font-body text-lg md:text-xl tracking-[0.1em]">
                还原真实
              </span>
            </div>
            <div className="w-12 h-0.5 bg-primary/30 rounded-full mt-5" />
          </div>
          <p className="text-text-secondary font-body text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            把修图推掉的墙扶正，把滤镜杀死的毛孔救活。上传一张照片，揭开美颜背后的真实面目。
          </p>
        </header>

        {appState === 'upload' && (
          <>
            <section className="flex flex-col items-center">
              {initializing ? (
                <div className="w-full max-w-md border-2 border-dashed border-primary/30 rounded-lg-card p-8 text-center bg-bg-surface shadow-card">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-primary font-display mb-3">
                    正在加载人脸检测模型...
                  </h3>
                  <p className="text-text-tertiary font-body text-sm">
                    首次加载需要下载约 30MB 模型文件，请稍候
                  </p>
                </div>
              ) : (
                <CyberpunkUpload onFileSelect={handleFileSelect} isProcessing={isProcessing || isDetecting} />
              )}
              
              <div className="mt-5 text-center">
                <div className="flex flex-wrap items-center justify-center gap-6 text-text-tertiary font-body text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>支持JPG,PNG</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                    <span>最大 5MB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span>单人照片</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-8">
              <DataDashboard />
            </div>

            <div className="mt-6 mb-6">
              <div className="flex items-center justify-center gap-1.5">
                <svg className="w-3 h-3 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
                <span className="text-text-tertiary font-body text-xs">本工具严格保护隐私，照片将在分析完成后自动销毁</span>
              </div>
            </div>
          </>
        )}

        {appState === 'result' && (
          error ? (
            <section id="results" className="text-center py-12">
              <div className="inline-flex flex-col items-center gap-6 px-8 py-6 bg-danger/10 border border-danger/20 rounded-lg-card shadow-card">
                <span className="text-4xl">⚠️</span>
                <p className="text-danger font-body text-lg">{error}</p>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-danger/20 border border-danger/30 rounded-lg-card font-body text-text-primary hover:bg-danger/30 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  <span>重新上传</span>
                </button>
              </div>
            </section>
          ) : (originalImage && processedImage && report && detectionMap) ? (
            <section id="results">
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl text-text-primary mb-4">{BRAND.name} 鉴定报告</h2>
                <p className="text-text-muted text-sm font-body">{BRAND.slogan}</p>
              </div>

              <HeatmapOverlay originalImage={originalImage} heatmapImage={report.heatmapImage} />

              <ReportDashboard report={report} detectionMap={detectionMap} originalImage={originalImage} heatmapImage={report.heatmapImage} onReset={handleReset} />

              <div className="text-center mt-12 mb-8">
                <div className="flex items-center justify-center gap-1.5">
                  <svg className="w-3 h-3 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
                  <span className="text-text-tertiary font-body text-xs">本工具严格保护隐私，照片将在分析完成后自动销毁</span>
                </div>
              </div>

              <div className="flex justify-center mb-8">
                <button
                  onClick={scrollToResults}
                  className="flex flex-col items-center text-text-muted hover:text-accent transition-colors"
                >
                  <svg className="w-6 h-6 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                  <span className="font-body text-xs mt-2">返回顶部</span>
                </button>
              </div>
            </section>
          ) : null
        )}
      </div>
    </div>
  );
}