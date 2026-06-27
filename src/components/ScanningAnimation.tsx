import { useEffect, useState } from 'react';

interface ScanningAnimationProps {
  imageSrc: string;
  progress: number;
  currentStep: string;
}

export function ScanningAnimation({ imageSrc, progress, currentStep }: ScanningAnimationProps) {
  const [scanLines, setScanLines] = useState<number[]>([]);

  useEffect(() => {
    const lines = Array.from({ length: 5 }, (_, i) => i * 20);
    setScanLines(lines);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-bg-page/95 backdrop-blur-md flex flex-col items-center justify-center animate-fadeIn">
      <div className="relative w-full max-w-2xl mx-4">
        <div className="relative rounded-lg-card overflow-hidden border border-primary/30 bg-bg-surface" style={{ boxShadow: '0 0 60px rgba(255, 0, 110, 0.2), 0 0 100px rgba(0, 245, 255, 0.1)' }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent z-10" />
          
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/60 rounded-tl-lg-card z-10" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-accent/60 rounded-tr-lg-card z-10" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-accent/60 rounded-bl-lg-card z-10" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/60 rounded-br-lg-card z-10" />
          
          <img
            src={imageSrc}
            alt="Scanning"
            className="w-full h-auto object-contain"
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-accent/10 pointer-events-none" />
          
          {scanLines.map((top, index) => (
            <div
              key={index}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60"
              style={{
                top: `${top + (progress % 20)}%`,
                animation: `scanLine 2s ease-in-out infinite`,
                animationDelay: `${index * 0.3}s`,
                boxShadow: '0 0 10px rgba(255, 0, 110, 0.8)',
              }}
            />
          ))}
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-0 right-0 h-16 bg-gradient-to-b from-primary/30 to-transparent" style={{ top: `${progress}%`, transform: 'translateY(-50%)', filter: 'blur(8px)' }} />
          </div>
        </div>
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display text-primary text-sm tracking-wider">{currentStep}</span>
            <span className="font-display text-accent text-2xl font-bold" style={{ textShadow: '0 0 10px rgba(0, 245, 255, 0.5)' }}>{progress}%</span>
          </div>
          
          <div className="relative h-2 bg-bg-card rounded-full overflow-hidden border border-primary/20">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300"
              style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(255, 0, 110, 0.5)' }}
            />
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-secondary to-accent opacity-50 blur-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-6">
            {['人脸检测', '磨皮分析', '形变识别', '滤镜检测'].map((label, index) => (
              <div key={label} className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${index <= Math.floor(progress / 25) ? 'bg-primary animate-pulse' : 'bg-text-muted'}`} style={index <= Math.floor(progress / 25) ? { boxShadow: '0 0 8px rgba(255, 0, 110, 0.6)' } : {}} />
                <span className="font-body text-xs text-text-tertiary mt-2">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scanLine {
          0%, 100% { opacity: 0.3; transform: translateY(-10px); }
          50% { opacity: 1; transform: translateY(10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ScanningAnimation;
