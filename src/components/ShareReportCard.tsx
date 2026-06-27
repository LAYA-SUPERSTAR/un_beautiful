import type { AnalysisReport } from '../hooks/useImageProcessing';
import type { DetectionMap } from '../types';
import { BRAND, DIMENSIONS } from '../config/brand';

interface ShareReportCardProps {
  report: AnalysisReport;
  detectionMap: DetectionMap;
  originalImage: string;
  heatmapImage?: string;
}

export function ShareReportCard({ report, detectionMap, originalImage, heatmapImage }: ShareReportCardProps) {
  const detections = [
    { key: 'eyesEnlarged', label: '眼部已被放大' },
    { key: 'jawNarrowed', label: '下颌已被推窄' },
    { key: 'skinSmooth', label: '皮肤毛孔已被大面积抹除' },
    { key: 'backgroundWarped', label: '背景线条发生扭曲' },
    { key: 'colorFiltered', label: '存在明显滤镜痕迹' },
  ];

  const activeDetections = detections.filter(d => detectionMap[d.key as keyof DetectionMap]);

  const getScoreColor = () => {
    if (report.totalRealityScore >= 80) return '#00F5FF';
    if (report.totalRealityScore >= 60) return '#A855F7';
    return '#FF006E';
  };

  const getScoreLabel = () => {
    if (report.totalRealityScore >= 85) return '天生丽质';
    if (report.totalRealityScore >= 70) return '轻微微调';
    if (report.totalRealityScore >= 50) return '中度美颜';
    return '算法捏人';
  };

  return (
    <div
      id="share-report-card"
      className="bg-bg-page text-text-primary"
      style={{ fontFamily: 'system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif', width: 750, position: 'relative', opacity: 1 }}
    >
      <div 
        className="relative p-8"
        style={{ 
          backgroundColor: '#0A0A14',
          backgroundImage: `
            linear-gradient(rgba(255, 0, 110, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.04) 1px, transparent 1px),
            radial-gradient(ellipse at 20% 0%, rgba(255, 0, 110, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, rgba(0, 245, 255, 0.12) 0%, transparent 50%)
          `,
          backgroundSize: '30px 30px, 30px 30px, 100% 300px, 100% 300px',
        }}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg-card bg-bg-card border border-primary/40 flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)' }}>
              <span className="text-2xl font-bold text-primary font-mono">{BRAND.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary tracking-wider">{BRAND.fullName}</h1>
              <p className="text-text-tertiary text-sm mt-1">{BRAND.slogan}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-text-tertiary text-xs mb-1">检测时间</div>
            <div className="text-text-secondary text-sm font-mono">{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="relative rounded-lg-card overflow-hidden border border-primary/30 bg-bg-surface">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent z-10" />
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-bg-page/80 backdrop-blur-sm rounded-sm-tag border border-primary/30">
              <span className="text-primary text-xs font-bold tracking-wider">原图</span>
            </div>
            <div className="aspect-square">
              <img src={originalImage} alt="原图" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="relative rounded-lg-card overflow-hidden border border-accent/30 bg-bg-surface">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent z-20" />
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-bg-page/80 backdrop-blur-sm rounded-sm-tag border border-accent/30">
              <span className="text-accent text-xs font-bold tracking-wider">AI还原</span>
            </div>
            <div className="aspect-square">
              <img src={originalImage} alt="AI还原" className="w-full h-full object-cover" />
            </div>
            {heatmapImage && (
              <div className="absolute inset-0 pointer-events-none z-10">
                <img src={heatmapImage} alt="热力图" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-bg-surface rounded-lg-card border border-primary/20 p-8 mb-10 relative overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)' }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/60 rounded-tl-lg-card" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-accent/60 rounded-tr-lg-card" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-accent/60 rounded-bl-lg-card" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary/60 rounded-br-lg-card" />
          
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <svg width="140" height="140" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#0A0A14" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={getScoreColor()}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - report.totalRealityScore / 100)}
                  style={{ filter: `drop-shadow(0 0 8px ${getScoreColor()})` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold" style={{ color: getScoreColor() }}>
                  {report.totalRealityScore}
                </span>
                <span className="text-sm text-text-secondary mt-2">{getScoreLabel()}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-text-muted/20 pt-8">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="text-text-secondary text-sm w-36 flex-shrink-0">赛博磨皮粉碎度</span>
                <div className="flex-1 h-2 bg-bg-page rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ 
                      width: `${report.skinSmoothingScore}%`, 
                      backgroundColor: report.skinSmoothingScore < 50 ? '#00F5FF' : DIMENSIONS.skin.color,
                      boxShadow: `0 0 6px ${report.skinSmoothingScore < 50 ? '#00F5FF' : DIMENSIONS.skin.color}`
                    }}
                  />
                </div>
                <span className="text-text-primary font-bold text-sm w-12 text-right">{report.skinSmoothingScore}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-text-secondary text-sm w-36 flex-shrink-0">液化推脸形变率</span>
                <div className="flex-1 h-2 bg-bg-page rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ 
                      width: `${report.facialWarpScore}%`, 
                      backgroundColor: report.facialWarpScore < 50 ? '#00F5FF' : DIMENSIONS.facial.color,
                      boxShadow: `0 0 6px ${report.facialWarpScore < 50 ? '#00F5FF' : DIMENSIONS.facial.color}`
                    }}
                  />
                </div>
                <span className="text-text-primary font-bold text-sm w-12 text-right">{report.facialWarpScore}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-text-secondary text-sm w-36 flex-shrink-0">时空扭曲痕迹</span>
                <div className="flex-1 h-2 bg-bg-page rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ 
                      width: `${report.backgroundDistortionScore}%`, 
                      backgroundColor: report.backgroundDistortionScore < 50 ? '#00F5FF' : DIMENSIONS.background.color,
                      boxShadow: `0 0 6px ${report.backgroundDistortionScore < 50 ? '#00F5FF' : DIMENSIONS.background.color}`
                    }}
                  />
                </div>
                <span className="text-text-primary font-bold text-sm w-12 text-right">{report.backgroundDistortionScore}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-text-secondary text-sm w-36 flex-shrink-0">厚码滤镜叠加层数</span>
                <div className="flex-1 h-2 bg-bg-page rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ 
                      width: `${report.filterIntensityScore}%`, 
                      backgroundColor: report.filterIntensityScore < 50 ? '#00F5FF' : DIMENSIONS.filter.color,
                      boxShadow: `0 0 6px ${report.filterIntensityScore < 50 ? '#00F5FF' : DIMENSIONS.filter.color}`
                    }}
                  />
                </div>
                <span className="text-text-primary font-bold text-sm w-12 text-right">{report.filterIntensityScore}</span>
              </div>
            </div>
          </div>
        </div>

        {activeDetections.length > 0 && (
          <div className="bg-bg-surface border border-primary/20 rounded-lg-card p-6 mb-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span className="text-primary font-bold">检测到修图痕迹</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {activeDetections.map(({ label }) => (
                <span
                  key={label}
                  className="px-4 py-2 rounded-sm-tag bg-primary/15 text-primary text-sm border border-primary/30"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {report.tags && report.tags.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <svg className="w-5 h-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span className="text-warning font-bold">趣味标签</span>
              <svg className="w-5 h-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {report.tags.slice(0, 5).map((tag, index) => (
                <span
                  key={tag}
                  className="px-5 py-2.5 rounded-sm-tag text-white text-sm font-bold"
                  style={{ 
                    backgroundColor: ['#FF006E', '#00F5FF', '#A855F7', '#F59E0B', '#EF4444'][index % 5],
                    boxShadow: `0 0 12px ${['#FF006E', '#00F5FF', '#A855F7', '#F59E0B', '#EF4444'][index % 5]}40`
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-text-muted/20 pt-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-lg-card bg-bg-card border border-primary/40 flex items-center justify-center">
              <span className="text-xl font-bold text-primary font-mono">{BRAND.name.charAt(0)}</span>
            </div>
            <span className="text-text-tertiary text-sm">扫码体验 {BRAND.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
