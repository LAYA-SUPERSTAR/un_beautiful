import { useEffect, useState } from 'react';
import type { AnalysisReport } from '../hooks/useImageProcessing';
import type { DetectionMap } from '../types';
import { useTagGenerator } from '../hooks/useTagGenerator';
import { ShareReportCard } from './ShareReportCard';
import { ShareModal } from './ShareModal';
import { Icon } from './Icon';
import { DIMENSIONS } from '../config/brand';
import html2canvas from 'html2canvas';

interface ReportDashboardProps {
  report: AnalysisReport;
  detectionMap: DetectionMap;
  originalImage: string;
  heatmapImage?: string;
  onReset?: () => void;
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const isLow = value < 50;
  const barColor = isLow ? '#EF4444' : color;

  return (
    <div className="flex items-center gap-4 py-3">
      <span className="text-text-secondary font-body text-sm w-32 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2 bg-bg-page rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${displayValue}%`, 
            backgroundColor: barColor,
            boxShadow: `0 0 8px ${barColor}`
          }}
        />
      </div>
      <span className="text-text-primary font-display text-sm w-12 text-right">{Math.round(displayValue)}</span>
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return '#00F5FF';
    if (score >= 60) return '#A855F7';
    return '#FF006E';
  };

  const getScoreLabel = () => {
    if (score >= 85) return '天生丽质';
    if (score >= 70) return '轻微微调';
    if (score >= 50) return '中度美颜';
    return '算法捏人';
  };

  return (
    <div className="relative w-40 h-40">
      <div className="absolute inset-0 rounded-full animate-pulse" style={{ 
        background: `radial-gradient(circle, ${getScoreColor()}20 0%, transparent 70%)`,
        animation: 'score-pulse 2s ease-in-out infinite',
      }} />

      <div className="absolute -inset-3 rounded-full border-2 border-transparent" style={{
        background: `conic-gradient(from 0deg, transparent 0%, ${getScoreColor()}40 25%, transparent 50%, ${getScoreColor()}40 75%, transparent 100%)`,
        animation: 'spin-slow 8s linear infinite',
        mask: 'radial-gradient(transparent 50%, black 52%, black 56%, transparent 58%)',
        WebkitMask: 'radial-gradient(transparent 50%, black 52%, black 56%, transparent 58%)',
      }} />

      <div className="absolute -inset-2 rounded-full border-2 border-transparent" style={{
        background: `conic-gradient(from 180deg, transparent 0%, ${getScoreColor()}30 25%, transparent 50%, ${getScoreColor()}30 75%, transparent 100%)`,
        animation: 'spin-reverse 6s linear infinite',
        mask: 'radial-gradient(transparent 58%, black 60%, black 64%, transparent 66%)',
        WebkitMask: 'radial-gradient(transparent 58%, black 60%, black 64%, transparent 66%)',
      }} />

      <div className="absolute -inset-2 rounded-full border border-transparent" style={{
        background: `linear-gradient(#121225, #121225) padding-box, linear-gradient(135deg, ${getScoreColor()}60, transparent, ${getScoreColor()}60) border-box`,
        animation: 'rotate-border 4s linear infinite',
      }} />

      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-0" style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${getScoreColor()}08 2px, ${getScoreColor()}08 4px)`,
          animation: 'scanline 4s linear infinite',
        }} />
      </div>

      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#0D0E12"
          strokeWidth="4"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getScoreColor()}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 10px ${getScoreColor()}) drop-shadow(0 0 20px ${getScoreColor()}80)`,
          }}
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getScoreColor()}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.03} ${circumference * 0.07}`}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          style={{
            opacity: 0.4,
            filter: `drop-shadow(0 0 6px ${getScoreColor()})`,
          }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-28 h-28 rounded-full" style={{
          background: `radial-gradient(circle at 30% 30%, ${getScoreColor()}30 0%, ${getScoreColor()}10 50%, transparent 70%)`,
        }} />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="relative">
          <span className="text-4xl font-bold font-display animate-glow" style={{ 
            color: getScoreColor(),
            textShadow: `0 0 15px ${getScoreColor()}, 0 0 30px ${getScoreColor()}80, 0 0 50px ${getScoreColor()}40`,
            animation: 'glow-pulse 2s ease-in-out infinite',
          }}>
            {displayScore}
          </span>
          <span className="absolute -right-4 top-1 text-sm font-display" style={{ 
            color: getScoreColor(),
            textShadow: `0 0 10px ${getScoreColor()}`,
          }}>%</span>
        </div>
        <span className="text-xs font-body mt-2 px-3 py-1 rounded-sm-tag border" style={{ 
          color: getScoreColor(),
          borderColor: `${getScoreColor()}60`,
          backgroundColor: `${getScoreColor()}15`,
          textShadow: `0 0 8px ${getScoreColor()}`,
          boxShadow: `0 0 12px ${getScoreColor()}20`,
        }}>
          {getScoreLabel()}
        </span>
      </div>

      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 border-t border-l rounded-tl-lg-card" style={{ borderColor: getScoreColor() }} />
      <div className="absolute top-1 right-1 w-3 h-3 border-t border-r rounded-tr-lg-card" style={{ borderColor: getScoreColor() }} />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l rounded-bl-lg-card" style={{ borderColor: getScoreColor() }} />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r rounded-br-lg-card" style={{ borderColor: getScoreColor() }} />

      <div className="absolute inset-0 rounded-full animate-orbit-dots">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ 
          backgroundColor: getScoreColor(),
          boxShadow: `0 0 8px ${getScoreColor()}, 0 0 16px ${getScoreColor()}`,
        }} />
      </div>
    </div>
  );
}

function DetectionCard({ detectionMap }: { detectionMap: DetectionMap }) {
  const detections = [
    { key: 'eyesEnlarged', label: '眼部已被放大', color: '#F59E0B' },
    { key: 'jawNarrowed', label: '下颌已被推窄', color: '#FF006E' },
    { key: 'skinSmooth', label: '皮肤毛孔已被大面积抹除', color: '#00F5FF' },
    { key: 'backgroundWarped', label: '背景线条发生扭曲', color: '#EF4444' },
    { key: 'colorFiltered', label: '存在明显滤镜痕迹', color: '#A855F7' },
  ];

  const activeDetections = detections.filter(d => detectionMap[d.key as keyof DetectionMap]);

  if (activeDetections.length === 0) {
    return (
      <div className="bg-bg-surface border border-primary/20 rounded-lg-card p-6 mt-8 mb-12 shadow-card">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="ShieldCheck" className="w-5 h-5 text-primary" />
          <h3 className="font-display text-sm text-primary">检测结果</h3>
        </div>
        <p className="text-primary font-body">未检测到明显修图痕迹，图像真实度较高。</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-danger/20 rounded-lg-card p-6 mt-8 mb-12 shadow-card">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="AlertTriangle" className="w-5 h-5 text-danger" />
        <h3 className="font-display text-sm text-danger">检测到修图痕迹</h3>
      </div>
      <div className="space-y-3">
        {activeDetections.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
            <span className="text-text-secondary font-body text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TagsDisplay({ tags }: { tags: string[] }) {
  const tagStyles = [
    { bg: '#FF006E', shadow: '0 0 15px rgba(255, 0, 110, 0.5), 0 0 30px rgba(255, 0, 110, 0.25)', border: 'rgba(255, 0, 110, 0.6)' },
    { bg: '#00F5FF', shadow: '0 0 15px rgba(0, 245, 255, 0.5), 0 0 30px rgba(0, 245, 255, 0.25)', border: 'rgba(0, 245, 255, 0.6)' },
    { bg: '#A855F7', shadow: '0 0 15px rgba(168, 85, 247, 0.5), 0 0 30px rgba(168, 85, 247, 0.25)', border: 'rgba(168, 85, 247, 0.6)' },
    { bg: '#EF4444', shadow: '0 0 15px rgba(239, 68, 68, 0.5), 0 0 30px rgba(239, 68, 68, 0.25)', border: 'rgba(239, 68, 68, 0.6)' },
    { bg: '#F59E0B', shadow: '0 0 15px rgba(245, 158, 11, 0.5), 0 0 30px rgba(245, 158, 11, 0.25)', border: 'rgba(245, 158, 11, 0.6)' },
    { bg: '#10B981', shadow: '0 0 15px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.25)', border: 'rgba(16, 185, 129, 0.6)' },
    { bg: '#F43F5E', shadow: '0 0 15px rgba(244, 63, 94, 0.5), 0 0 30px rgba(244, 63, 94, 0.25)', border: 'rgba(244, 63, 94, 0.6)' },
    { bg: '#8B5CF6', shadow: '0 0 15px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.25)', border: 'rgba(139, 92, 246, 0.6)' },
    { bg: '#EC4899', shadow: '0 0 15px rgba(236, 72, 153, 0.5), 0 0 30px rgba(236, 72, 153, 0.25)', border: 'rgba(236, 72, 153, 0.6)' },
    { bg: '#06B6D4', shadow: '0 0 15px rgba(6, 182, 212, 0.5), 0 0 30px rgba(6, 182, 212, 0.25)', border: 'rgba(6, 182, 212, 0.6)' },
    { bg: '#FBBF24', shadow: '0 0 15px rgba(251, 191, 36, 0.5), 0 0 30px rgba(251, 191, 36, 0.25)', border: 'rgba(251, 191, 36, 0.6)' },
    { bg: '#0EA5E9', shadow: '0 0 15px rgba(14, 165, 233, 0.5), 0 0 30px rgba(14, 165, 233, 0.25)', border: 'rgba(14, 165, 233, 0.6)' },
  ];

  return (
    <div className="mt-8 mb-12">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Icon name="Star" className="w-5 h-5 text-warning" />
        <h3 className="font-display text-sm text-warning">趣味标签</h3>
        <Icon name="Star" className="w-5 h-5 text-warning" />
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {tags.map((tag, index) => {
          const style = tagStyles[index % tagStyles.length];
          return (
            <span
              key={tag}
              className="px-4 py-2 rounded-sm-tag font-body text-sm font-bold text-white border-2"
              style={{ 
                animationDelay: `${index * 100}ms`,
                backgroundColor: style.bg,
                borderColor: style.border,
                boxShadow: style.shadow,
              }}
            >
              #{tag}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function CyberTagCard({ tag }: { tag: { title: string; text: string; style: string; emoji?: string } }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);

  const styles = {
    green: {
      accent: '#00F5FF',
      bg: 'bg-cyan-900/25',
      border: 'border-accent',
      glow: 'shadow-glow-accent',
      animation: 'pulse-accent 2s ease-in-out infinite',
      innerGlow: 'rgba(0, 245, 255, 0.15)',
      labelBg: 'bg-accent/10',
      name: '原生微瑕轻奢区',
    },
    yellow: {
      accent: '#A855F7',
      bg: 'bg-purple-900/25',
      border: 'border-secondary',
      glow: 'shadow-glow-secondary',
      animation: 'float-card 4s ease-in-out infinite',
      innerGlow: 'rgba(168, 85, 247, 0.15)',
      labelBg: 'bg-secondary/10',
      name: '微调科技伪装区',
    },
    red: {
      accent: '#FF006E',
      bg: 'bg-pink-900/25',
      border: 'border-primary',
      glow: 'shadow-glow-primary',
      animation: 'glitch-alert 0.3s ease-in-out infinite',
      innerGlow: 'rgba(255, 0, 110, 0.2)',
      labelBg: 'bg-primary/10',
      name: '重度赛博换头区',
    },
    gold: {
      accent: '#FFD700',
      bg: 'bg-amber-900/30',
      border: 'border-yellow-400',
      glow: '',
      animation: 'gold-shimmer 3s ease-in-out infinite',
      innerGlow: 'rgba(255, 215, 0, 0.2)',
      labelBg: 'bg-yellow-500/20',
      name: '天生丽质免检区',
    },
  };

  const shareText = `${tag.emoji || ''} ${tag.title}\n\n${tag.text}\n\n— 来自「真亦假」AI鉴定`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tag.title,
          text: shareText,
        });
      } catch (err) {
        console.error('分享失败:', err);
      }
    } else {
      handleCopy();
    }
    setShowShareModal(false);
  };

  const style = styles[tag.style as keyof typeof styles] || styles.green;
  const isGold = tag.style === 'gold';
  const isRed = tag.style === 'red';
  const isGreen = tag.style === 'green';
  const isYellow = tag.style === 'yellow';

  return (
    <>
      <div className="mt-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Icon name={isGold ? 'Crown' : isRed ? 'Zap' : isGreen ? 'Sparkles' : 'Ghost'} className={`w-5 h-5 ${isGold ? 'animate-bounce' : isRed ? 'animate-pulse' : isGreen ? 'animate-spin-slow' : ''}`} style={{ 
            color: style.accent, 
            filter: `drop-shadow(0 0 8px ${style.accent})`,
          }} />
          <h3 className="font-display text-sm" style={{ 
            color: style.accent,
            textShadow: isGold ? `0 0 15px ${style.accent}` : undefined,
            animation: isRed ? 'flicker-text 0.5s ease-in-out infinite' : undefined,
          }}>AI 毒舌/赞美金句</h3>
          <Icon name={isGold ? 'Crown' : isRed ? 'Zap' : isGreen ? 'Sparkles' : 'Ghost'} className={`w-5 h-5 ${isGold ? 'animate-bounce' : isRed ? 'animate-pulse' : isGreen ? 'animate-spin-slow' : ''}`} style={{ 
            color: style.accent, 
            filter: `drop-shadow(0 0 8px ${style.accent})`,
          }} />
        </div>
        
        <div
          className={`relative rounded-lg-card p-8 border-2 ${style.bg} ${style.border} ${style.glow} overflow-hidden cursor-pointer transition-transform duration-300 ${cardHovered ? 'scale-[1.02]' : ''}`}
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
          onClick={() => setShowShareModal(true)}
          style={{ 
            animation: style.animation,
            boxShadow: isGold 
              ? `0 0 60px rgba(255, 215, 0, 0.4), 0 0 100px rgba(255, 215, 0, 0.2), inset 0 0 80px rgba(255, 215, 0, 0.1), 0 8px 32px rgba(0,0,0,0.5)`
              : isRed
                ? `0 0 40px rgba(255, 0, 110, 0.5), 0 0 80px rgba(255, 0, 110, 0.25), inset 0 0 60px rgba(255, 0, 110, 0.15), 0 8px 32px rgba(0,0,0,0.5)`
                : `0 0 40px ${style.accent}40, 0 0 80px ${style.accent}20, inset 0 0 60px ${style.innerGlow}, 0 8px 32px rgba(0,0,0,0.5)`,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-60" style={{ color: style.accent }} />
          
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 rounded-tl-lg-card" style={{ borderColor: style.accent }} />
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 rounded-tr-lg-card" style={{ borderColor: style.accent }} />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 rounded-bl-lg-card" style={{ borderColor: style.accent }} />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 rounded-br-lg-card" style={{ borderColor: style.accent }} />

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(isGold ? 30 : isRed ? 15 : 10)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: isGold ? 'rgba(255, 215, 0, 0.4)' : isRed ? 'rgba(255, 0, 110, 0.3)' : `${style.accent}40`,
                  animation: `twinkle ${Math.random() * 3 + 1}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`,
                  boxShadow: isGold ? `0 0 8px rgba(255, 215, 0, 0.6)` : isRed ? `0 0 6px rgba(255, 0, 110, 0.5)` : `0 0 6px ${style.accent}`,
                }}
              />
            ))}
          </div>

          {isGold && (
            <>
              <div className="absolute top-2 right-2 text-3xl animate-spin-slow" style={{ animationDuration: '8s' }}>★</div>
              <div className="absolute bottom-2 left-2 text-2xl animate-spin-reverse" style={{ animationDuration: '12s' }}>☆</div>
            </>
          )}

          {isRed && (
            <>
              <div className="absolute top-2 right-2 text-2xl animate-pulse">🚨</div>
              <div className="absolute top-2 left-2 text-xl animate-bounce">⚠️</div>
            </>
          )}

          {isGreen && (
            <div className="absolute top-2 right-2 text-xl animate-float">✨</div>
          )}

          {isYellow && (
            <div className="absolute top-2 right-2 text-xl animate-wiggle">🤖</div>
          )}

          <div className="flex items-center justify-center mb-6">
            <div className="px-4 py-1.5 rounded-sm-tag border" style={{ 
              backgroundColor: `${style.accent}15`,
              borderColor: `${style.accent}40`,
              boxShadow: isGold ? `0 0 15px rgba(255, 215, 0, 0.3)` : isRed ? `0 0 10px rgba(255, 0, 110, 0.3)` : `0 0 10px ${style.accent}20`,
            }}>
              <span className="font-display text-xs font-bold flex items-center gap-1.5" style={{ 
                color: style.accent, 
                textShadow: isGold ? `0 0 10px ${style.accent}` : isRed ? `0 0 8px ${style.accent}` : undefined,
              }}>
                {tag.emoji}
                {tag.title}
              </span>
            </div>
          </div>

          <div className="text-center relative z-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-current opacity-40" style={{ color: style.accent }} />
              <span className="text-xs font-body opacity-50" style={{ color: style.accent }}>{style.name}</span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-current opacity-40" style={{ color: style.accent }} />
            </div>
            <p className={`text-xl font-body font-semibold leading-relaxed ${isRed ? 'animate-flicker-text' : ''}`} style={{ 
              color: isGold ? '#FFD700' : '#FFFFFF',
              textShadow: isGold 
                ? `0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3)`
                : isRed
                  ? `0 0 20px rgba(255, 0, 110, 0.5)`
                  : `0 0 20px ${style.innerGlow}`,
            }}>
              {tag.text}
            </p>
            <span className="inline-block w-2 h-5 bg-current ml-1 align-middle opacity-60 animate-blink" style={{ color: style.accent }} />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowShareModal(true);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-sm-tag border-2 transition-all hover:scale-105 font-bold ${isGold ? 'animate-pulse' : ''}`}
              style={{ 
                backgroundColor: `${style.accent}20`, 
                borderColor: style.accent, 
                color: style.accent,
                boxShadow: isGold 
                  ? `0 0 30px rgba(255, 215, 0, 0.5), inset 0 0 15px rgba(255, 215, 0, 0.2)`
                  : isRed
                    ? `0 0 20px rgba(255, 0, 110, 0.5), inset 0 0 10px rgba(255, 0, 110, 0.1)`
                    : `0 0 20px ${style.accent}30`,
              }}
            >
              <Icon name="Share2" className="w-5 h-5" style={{ filter: `drop-shadow(0 0 6px ${style.accent})` }} />
              <span className="font-body text-sm">{isGold ? '炫耀到朋友圈' : '分享金句'}</span>
            </button>
          </div>

          <div className="absolute bottom-2 right-2 text-xs opacity-30 font-body" style={{ color: style.accent }}>
            {isGold ? '🏆 稀有度 MAX' : isRed ? '⚠️ 危险等级 HIGH' : isGreen ? '✨ 品质 S' : '🤖 检测完成'}
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-surface border border-text-tertiary/30 rounded-lg-card p-card-padding w-full max-w-sm mx-page-margin shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg text-text-primary">分享金句</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-bg-card rounded-sm-tag p-card-padding mb-6">
              <p className="text-text-secondary text-xs font-body mb-2">{tag.title}</p>
              <p className="text-text-primary font-body text-sm">{tag.text}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm-tag border transition-all hover:scale-105 ${copied ? 'bg-primary/20 border-primary text-primary' : 'bg-bg-card border-text-tertiary/30 text-text-primary hover:bg-bg-surface'}`}
              >
                <Icon name={copied ? 'Check' : 'Copy'} className="w-5 h-5" />
                <span className="font-body">{copied ? '已复制' : '复制文字'}</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm-tag bg-primary text-text-primary font-body hover:opacity-90 transition-all hover:scale-105"
              >
                <Icon name="Share2" className="w-5 h-5" />
                <span>分享到社交平台</span>
              </button>

              <p className="text-center text-text-muted text-xs font-body mt-4">
                提示：复制后可粘贴到微信、微博等平台分享
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ReportDashboard({ report, detectionMap, originalImage, heatmapImage, onReset }: ReportDashboardProps) {
  const { randomTags, quote } = useTagGenerator(report.totalRealityScore);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const handleGenerateShareImage = async () => {
    setIsGenerating(true);
    
    try {
      const cardElement = document.getElementById('share-report-card');
      if (cardElement) {
        const canvas = await html2canvas(cardElement, {
          scale: 2,
          backgroundColor: '#050508',
          useCORS: true,
          logging: false,
        });
        const dataUrl = canvas.toDataURL('image/png');
        setShareImageUrl(dataUrl);
        setShowShareModal(true);
      }
    } catch (error) {
      console.error('生成分享图片失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-bg-surface rounded-lg-card border border-primary/20 p-6 mb-12 shadow-card relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        
        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/60 rounded-tl-lg-card" />
        <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-accent/60 rounded-tr-lg-card" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-accent/60 rounded-bl-lg-card" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary/60 rounded-br-lg-card" />
        
        <div className="flex items-center justify-center mb-8">
          <ScoreCircle score={report.totalRealityScore} />
        </div>
        
        <div className="border-t border-text-muted/20 pt-8">
          <MetricBar
            value={report.skinSmoothingScore}
            label={DIMENSIONS.skin.label}
            color={DIMENSIONS.skin.color}
          />
          <MetricBar
            value={report.facialWarpScore}
            label={DIMENSIONS.facial.label}
            color={DIMENSIONS.facial.color}
          />
          <MetricBar
            value={report.backgroundDistortionScore}
            label={DIMENSIONS.background.label}
            color={DIMENSIONS.background.color}
          />
          <MetricBar
            value={report.filterIntensityScore}
            label={DIMENSIONS.filter.label}
            color={DIMENSIONS.filter.color}
          />
        </div>
      </div>

      <TagsDisplay tags={randomTags} />

      <DetectionCard detectionMap={detectionMap} />

      {quote && <CyberTagCard tag={quote} />}

      <div className="mt-12 text-center">
        <button
          onClick={handleGenerateShareImage}
          disabled={isGenerating}
          className={`relative inline-flex items-center gap-3 px-10 py-5 rounded-lg-card font-display font-bold text-lg transition-all duration-300 overflow-hidden ${
            isGenerating
              ? 'bg-bg-surface text-text-muted cursor-not-allowed'
              : 'text-text-primary cursor-pointer hover:scale-105 hover:brightness-110'
          }`}
          style={isGenerating ? {} : {
            background: 'linear-gradient(135deg, #FF006E 0%, #A855F7 50%, #00F5FF 100%)',
            boxShadow: '0 0 30px rgba(255, 0, 110, 0.5), 0 0 60px rgba(255, 0, 110, 0.3), 0 0 90px rgba(0, 245, 255, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            animation: 'button-pulse 2s ease-in-out infinite',
          }}
          onMouseEnter={(e) => {
            if (!isGenerating) {
              e.currentTarget.style.animation = 'none';
              e.currentTarget.style.boxShadow = '0 0 50px rgba(255, 0, 110, 0.7), 0 0 100px rgba(255, 0, 110, 0.4), 0 0 150px rgba(0, 245, 255, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isGenerating) {
              e.currentTarget.style.animation = 'button-pulse 2s ease-in-out infinite';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 0, 110, 0.5), 0 0 60px rgba(255, 0, 110, 0.3), 0 0 90px rgba(0, 245, 255, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)';
            }
          }}
        >
          {!isGenerating && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine" />
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/30 rounded-full blur-xl animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-accent/30 rounded-full blur-xl animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            </>
          )}
          
          <span className="relative z-10 flex items-center gap-3">
            {isGenerating ? (
              <div className="w-6 h-6 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Icon name="Zap" className="w-6 h-6 animate-pulse" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' }} />
                <Icon name="Download" className="w-6 h-6" />
              </>
            )}
            {isGenerating ? '生成中...' : '一键生成鉴定长图'}
          </span>
        </button>
        <p className="text-xs text-text-muted mt-4 font-body">生成高颜值社交分享图，一键分享至朋友圈/小红书</p>
      </div>

      {onReset && (
        <div className="flex justify-center mt-12">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 bg-bg-surface border border-primary/20 rounded-lg-card font-body text-text-primary hover:bg-bg-card transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            <span>上传新照片</span>
          </button>
        </div>
      )}

      <div className="bg-bg-surface border border-text-muted/20 rounded-lg-card p-6 mt-12 shadow-card relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="flex items-center gap-2 mb-6">
          <Icon name="ShieldCheck" className="w-5 h-5 text-primary" />
          <h3 className="font-display text-sm text-primary">鉴定算法说明</h3>
        </div>
        <div className="font-body text-sm text-text-secondary space-y-3">
          <p>真实度指数 = 100 - 综合美化度</p>
          <p>综合美化度 = 赛博磨皮粉碎度 + 液化推脸形变率 + 时空扭曲痕迹 + 厚码滤镜叠加层数</p>
        </div>
      </div>

      <div className="fixed left-0 top-0 pointer-events-none z-[-1] opacity-0">
        <ShareReportCard
          report={report}
          detectionMap={detectionMap}
          originalImage={originalImage}
          heatmapImage={heatmapImage}
        />
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        imageUrl={shareImageUrl}
      />
    </div>
  );
}
