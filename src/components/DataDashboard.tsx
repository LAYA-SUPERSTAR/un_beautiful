import { useState, useEffect, useRef } from 'react';

const REPORTS = [
  '刚刚，来自上海的用户鉴定了网恋对象照片，含真量仅 12%，触发「赛博降头」警告！',
  '热烈祝贺！一位来自成都的用户通过了检测，含真量 98%，荣获「原生态神颜」免检认证！🎉',
  '3秒前，一位匿名用户提交了取证，系统成功粉碎了 8 层赛博磨皮，还原了真实毛孔。',
  '警告！检测到某千万网红照片出现「时空扭曲痕迹」，墙缝弯曲度达 84%！',
  '刚刚，一位北京的用户解锁了「P图热力图」，其下颌骨液化推脸痕迹已被红黄色块精准锁定。',
  '实时：全网今日已成功还原 43,219 张「照骗」，容貌焦虑粉碎率达 99%。',
];

function AnimatedNumber({ value }: { value: number }) {
  const digits = value.toLocaleString().split('');
  
  return (
    <div className="flex items-end gap-0.5">
      {digits.map((digit, index) => (
        <div
          key={index}
          className="relative w-5 h-7 bg-bg-card rounded-sm-tag border border-primary/30 flex items-center justify-center overflow-hidden"
          style={{
            boxShadow: '0 0 8px rgba(255, 0, 110, 0.2), inset 0 0 6px rgba(255, 0, 110, 0.08)',
          }}
        >
          <span className="text-primary font-bold text-sm font-mono leading-none" style={{ textShadow: '0 0 8px rgba(255, 0, 110, 0.7)' }}>
            {digit}
          </span>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        </div>
      ))}
    </div>
  );
}

export function DataDashboard() {
  const [count, setCount] = useState(0);
  const [currentReport, setCurrentReport] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const reportIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const baseValue = 1284763;
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(baseValue * easeOut);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        intervalRef.current = window.setInterval(() => {
          const increment = Math.floor(Math.random() * 3) + 1;
          setCount(prev => prev + increment);
        }, Math.floor(Math.random() * 2500) + 1500);
      }
    };
    
    requestAnimationFrame(animate);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const cycleReport = () => {
      setIsFading(true);
      
      setTimeout(() => {
        setCurrentReport(prev => (prev + 1) % REPORTS.length);
        setTimeout(() => {
          setIsFading(false);
        }, 50);
      }, 400);
    };
    
    reportIntervalRef.current = window.setInterval(cycleReport, 4500);
    
    return () => {
      if (reportIntervalRef.current) {
        clearInterval(reportIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-bg-surface rounded-lg-card border border-primary/20 p-3 shadow-card relative overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 20px rgba(255, 0, 110, 0.1)' }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-primary animate-cyber-flicker" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-8h-9l1-8z" />
            </svg>
            <span className="text-primary font-display text-xs tracking-wider">全网含真量检测</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
            <span className="text-primary font-body text-xs">实时</span>
          </div>
        </div>
        
        <div className="flex items-baseline justify-center gap-2 mb-3">
          <AnimatedNumber value={count} />
          <span className="text-primary font-body text-xs">累计检测</span>
        </div>
        
        <div className="relative h-8 overflow-hidden bg-bg-card rounded-sm-tag border border-primary/20">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent" />
          <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent to-primary" />
          
          <div className="absolute inset-0 flex items-center px-3">
            <div
              className="absolute inset-0 flex items-center px-3 transition-opacity duration-700 ease-in-out"
              style={{ opacity: isFading ? 0 : 1, transform: isFading ? 'translateY(-3px)' : 'translateY(0)' }}
            >
              <svg className="w-3.5 h-3.5 text-warning mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
              <span className="text-primary font-display text-xs mr-2 flex-shrink-0">[实时情报]</span>
              <span className="text-text-secondary font-body text-xs truncate">{REPORTS[currentReport]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
