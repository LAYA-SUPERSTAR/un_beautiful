interface CyberpunkUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function CyberpunkUpload({ onFileSelect, isProcessing }: CyberpunkUploadProps) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isProcessing) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    if (isProcessing) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    };
    input.click();
  };

  return (
    <div
      className={`relative w-full max-w-md mx-auto aspect-[4/3] rounded-lg-card border-2 border-dashed transition-all duration-300 cursor-pointer ${
        isProcessing
          ? 'border-text-muted bg-bg-surface/50 cursor-not-allowed'
          : 'border-primary/40 hover:border-primary hover:bg-bg-surface hover:shadow-glow-primary'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-lg-card" />
      
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/60 rounded-tl-lg-card" />
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-accent/60 rounded-tr-lg-card" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-accent/60 rounded-bl-lg-card" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/60 rounded-br-lg-card" />
      
      <div className="flex flex-col items-center justify-center h-full px-6 relative z-10">
        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: 'radial-gradient(circle, rgba(255, 0, 110, 0.4) 0%, transparent 70%)' }} />
          
          <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />
          
          <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin-slow" style={{ background: 'conic-gradient(from 0deg, transparent 0%, #FF006E 25%, transparent 50%)', mask: 'radial-gradient(transparent 55%, black 56%, black 60%, transparent 61%)', WebkitMask: 'radial-gradient(transparent 55%, black 56%, black 60%, transparent 61%)' }} />
          
          <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin-reverse" style={{ background: 'conic-gradient(from 180deg, transparent 0%, #00F5FF 25%, transparent 50%)', mask: 'radial-gradient(transparent 48%, black 49%, black 52%, transparent 53%)', WebkitMask: 'radial-gradient(transparent 48%, black 49%, black 52%, transparent 53%)' }} />
          
          <div className="absolute inset-0 rounded-full animate-orbit-dots">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" style={{ boxShadow: '0 0 6px #FF006E, 0 0 12px #FF006E' }} />
          </div>
          <div className="absolute inset-0 rounded-full animate-orbit-dots-reverse">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" style={{ boxShadow: '0 0 4px #00F5FF, 0 0 8px #00F5FF' }} />
          </div>
          
          <div className="relative w-12 h-12 bg-bg-card rounded-full flex items-center justify-center border border-primary/50 animate-float" style={{ boxShadow: '0 0 20px rgba(255, 0, 110, 0.4), 0 0 40px rgba(255, 0, 110, 0.2), inset 0 0 15px rgba(0, 245, 255, 0.1)' }}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
            <svg className="w-6 h-6 text-primary relative z-10 animate-pulse-glow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 4px #FF006E)' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
        </div>
        
        <h3 className="font-display text-lg text-primary mb-1 tracking-wider">
          {isProcessing ? '正在分析中...' : '上传照片'}
        </h3>
        
        <p className="text-text-secondary font-body text-xs text-center">
          {isProcessing 
            ? 'AI正在深度分析图片特征，请稍候...' 
            : '拖拽图片到此处或点击选择文件'}
        </p>
        
        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm-tag bg-bg-card border border-primary/30 text-primary text-xs font-body" style={{ boxShadow: '0 0 8px rgba(255, 0, 110, 0.15)' }}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22c5.5 0 10-4.5 10-10V5l-10-3L2 5v7c0 5.5 4.5 10 10 10z"/>
              <path d="M8 12l2 2 4-4"/>
            </svg>
            隐私保护
          </span>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-b-lg-card" />
    </div>
  );
}
