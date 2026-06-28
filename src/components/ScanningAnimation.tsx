import { useEffect, useState } from 'react';

interface ScanningAnimationProps {
  imageSrc: string;
  progress: number;
  currentStep: string;
}

export function ScanningAnimation({ imageSrc, progress, currentStep }: ScanningAnimationProps) {
  const [scanLines, setScanLines] = useState<number[]>([]);
  const isComplete = progress === 100;

  useEffect(() => {
    const lines = Array.from({ length: 5 }, (_, i) => i * 20);
    setScanLines(lines);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-bg-page/95 backdrop-blur-md flex flex-col items-center justify-center animate-fadeIn">
      <div className="relative w-full max-w-2xl mx-4">
        <div className={`relative rounded-lg-card overflow-hidden border transition-all duration-500 ${isComplete ? 'border-accent/60' : 'border-primary/30'} bg-bg-surface`} style={{ boxShadow: isComplete ? '0 0 80px rgba(0, 245, 255, 0.3), 0 0 120px rgba(0, 245, 255, 0.15)' : '0 0 60px rgba(255, 0, 110, 0.2), 0 0 100px rgba(0, 245, 255, 0.1)' }}>
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-${isComplete ? 'accent' : 'primary'}/60 to-transparent z-10 transition-all duration-500`} style={{ background: `linear-gradient(to right, transparent, ${isComplete ? 'rgba(0, 245, 255, 0.6)' : 'rgba(255, 0, 110, 0.6)'}, transparent)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent z-10" style={{ background: `linear-gradient(to right, transparent, ${isComplete ? 'rgba(255, 0, 110, 0.6)' : 'rgba(0, 245, 255, 0.6)'}, transparent)` }} />
          
          <div className={`absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 ${isComplete ? 'border-accent/60' : 'border-primary/60'} rounded-tl-lg-card z-10 transition-all duration-500`} />
          <div className={`absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 ${isComplete ? 'border-primary/60' : 'border-accent/60'} rounded-tr-lg-card z-10 transition-all duration-500`} />
          <div className={`absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 ${isComplete ? 'border-primary/60' : 'border-accent/60'} rounded-bl-lg-card z-10 transition-all duration-500`} />
          <div className={`absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 ${isComplete ? 'border-accent/60' : 'border-primary/60'} rounded-br-lg-card z-10 transition-all duration-500`} />
          
          <img
            src={imageSrc}
            alt="Scanning"
            className={`w-full h-auto object-contain transition-all duration-500 ${isComplete ? 'brightness-110' : ''}`}
          />
          
          <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${isComplete ? 'bg-accent/5' : 'bg-gradient-to-b from-primary/10 via-transparent to-accent/10'}`} />
          
          {!isComplete && scanLines.map((top, index) => (
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
          
          {!isComplete && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-0 right-0 h-16 bg-gradient-to-b from-primary/30 to-transparent" style={{ top: `${progress}%`, transform: 'translateY(-50%)', filter: 'blur(8px)' }} />
            </div>
          )}

          {isComplete && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="text-6xl animate-bounce" style={{ textShadow: '0 0 30px rgba(0, 245, 255, 0.8)' }}>
                ✨
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className={`font-display text-sm tracking-wider transition-all duration-300 ${isComplete ? 'text-accent' : 'text-primary'}`} style={{ textShadow: isComplete ? '0 0 10px rgba(0, 245, 255, 0.5)' : 'none' }}>
              {currentStep}
            </span>
            <span className={`font-display text-2xl font-bold transition-all duration-300 ${isComplete ? 'text-accent animate-pulse' : 'text-accent'}`} style={{ textShadow: isComplete ? '0 0 15px rgba(0, 245, 255, 0.7), 0 0 30px rgba(0, 245, 255, 0.4)' : '0 0 10px rgba(0, 245, 255, 0.5)' }}>
              {progress}%
            </span>
          </div>
          
          <div className={`relative h-2 bg-bg-card rounded-full overflow-hidden border transition-all duration-500 ${isComplete ? 'border-accent/40' : 'border-primary/20'}`}>
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-500 ${isComplete ? 'animate-pulse' : ''}`}
              style={{ 
                width: `${progress}%`, 
                background: isComplete 
                  ? 'linear-gradient(to right, #00F5FF, #FF006E, #00F5FF)' 
                  : 'linear-gradient(to right, #FF006E, #8338EC, #00F5FF)',
                boxShadow: isComplete 
                  ? '0 0 15px rgba(0, 245, 255, 0.7), 0 0 30px rgba(0, 245, 255, 0.4)' 
                  : '0 0 10px rgba(255, 0, 110, 0.5)',
                backgroundSize: isComplete ? '200% 100%' : '100% 100%',
                animation: isComplete ? 'shimmer 1.5s linear infinite' : 'none'
              }}
            />
            <div
              className="absolute top-0 left-0 h-full opacity-50 blur-sm"
              style={{ 
                width: `${progress}%`, 
                background: isComplete 
                  ? 'linear-gradient(to right, #00F5FF, #FF006E, #00F5FF)' 
                  : 'linear-gradient(to right, #FF006E, #8338EC, #00F5FF)',
              }}
            />
          </div>
          
          <div className="flex justify-between mt-6">
            {['人脸检测', '磨皮分析', '形变识别', '滤镜检测'].map((label, index) => (
              <div key={label} className="flex flex-col items-center">
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index <= Math.floor(progress / 25) ? (isComplete ? 'bg-accent' : 'bg-primary') : 'bg-text-muted'} ${isComplete && index === 3 ? 'animate-ping' : index <= Math.floor(progress / 25) ? 'animate-pulse' : ''}`} 
                  style={index <= Math.floor(progress / 25) ? { boxShadow: isComplete ? '0 0 8px rgba(0, 245, 255, 0.8)' : '0 0 8px rgba(255, 0, 110, 0.6)' } : {}} 
                />
                <span className={`font-body text-xs mt-2 transition-all duration-300 ${index <= Math.floor(progress / 25) ? (isComplete ? 'text-accent' : 'text-text-tertiary') : 'text-text-tertiary'}`}>{label}</span>
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
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ScanningAnimation;
