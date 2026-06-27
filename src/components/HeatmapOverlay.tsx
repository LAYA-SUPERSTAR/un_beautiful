interface HeatmapOverlayProps {
  originalImage: string;
  heatmapImage: string;
}

export function HeatmapOverlay({ originalImage, heatmapImage }: HeatmapOverlayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="grid grid-cols-2 gap-6">
        <div className="relative rounded-lg-card overflow-hidden border border-primary/30 bg-bg-surface shadow-card">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent z-10" />
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-bg-page/80 backdrop-blur-sm rounded-sm-tag border border-primary/30">
            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            <span className="text-primary text-xs font-display tracking-wider">原图</span>
          </div>
          <div className="aspect-square">
            <img
              src={originalImage}
              alt="原图"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="relative rounded-lg-card overflow-hidden border border-accent/30 bg-bg-surface shadow-card">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent z-20" />
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-bg-page/80 backdrop-blur-sm rounded-sm-tag border border-accent/30">
            <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            </svg>
            <span className="text-accent text-xs font-display tracking-wider">AI还原</span>
          </div>
          <div className="aspect-square">
            <img
              src={originalImage}
              alt="AI还原"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="absolute inset-0 pointer-events-none z-10">
            <img
              src={heatmapImage}
              alt="热力图"
              className="w-full h-full object-contain opacity-60 mix-blend-overlay"
            />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="flex items-center justify-center gap-4 bg-bg-page/80 backdrop-blur-sm rounded-sm-tag p-3 border border-accent/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" style={{ boxShadow: '0 0 6px rgba(0, 245, 255, 0.5)' }} />
                <span className="text-accent text-xs font-body">低</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning" style={{ boxShadow: '0 0 6px rgba(245, 158, 11, 0.5)' }} />
                <span className="text-warning text-xs font-body">中</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" style={{ boxShadow: '0 0 6px rgba(255, 0, 110, 0.5)' }} />
                <span className="text-primary text-xs font-body">高</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}