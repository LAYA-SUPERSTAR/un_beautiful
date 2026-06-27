import { useState, useEffect } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  tip?: string;
}

export function ShareModal({ isOpen, onClose, imageUrl, title = '赛博取证报告', tip = '长按上方图片保存，即可分享至朋友圈/小红书' }: ShareModalProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setDownloaded(false);
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `真亦假_分享_${Date.now()}.png`;
    link.href = imageUrl;
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md mx-4 bg-bg-surface rounded-lg-card border border-primary/20 shadow-card overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="flex items-center justify-between p-4 border-b border-text-muted/20">
          <h3 className="font-display text-lg text-text-primary tracking-wider">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-sm-tag hover:bg-bg-card transition-colors text-text-tertiary hover:text-text-primary"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="p-4">
          <div className="bg-bg-card/50 rounded-lg-card p-4 mb-4 border border-primary/10">
            <div className="text-center mb-4">
              <span className="text-accent font-body text-sm">—— 已为你生成 {title} ——</span>
            </div>
            
            <div className="relative rounded-lg-card overflow-hidden border border-accent/20">
              {isLoading ? (
                <div className="aspect-[3/4] flex items-center justify-center bg-bg-surface">
                  <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" style={{ boxShadow: '0 0 15px rgba(0, 245, 255, 0.3)' }} />
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt="取证报告"
                  className="w-full h-auto rounded-lg-card"
                  style={{ maxHeight: '60vh', objectFit: 'contain' }}
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                <p className="text-text-primary font-body text-sm bg-black/50 backdrop-blur-sm inline-block px-4 py-2 rounded-sm-tag">
                  💡 {tip}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg-card font-body font-bold transition-all ${
                downloaded
                  ? 'bg-success text-white'
                  : 'bg-gradient-to-r from-primary to-accent text-white hover:opacity-90'
              }`}
              style={!downloaded ? { boxShadow: '0 0 15px rgba(255, 0, 110, 0.3)' } : {}}
            >
              {downloaded ? (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                  下载成功
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  下载长图
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg-card font-body font-bold bg-bg-card text-text-secondary hover:bg-bg-surface transition-colors border border-text-muted/20"
            >
              关闭
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-text-tertiary">
              图片已保存至本地相册，快去朋友圈炫耀一下吧！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
