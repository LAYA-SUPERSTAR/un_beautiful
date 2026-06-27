interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export function ErrorModal({ isOpen, message, onClose }: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 bg-bg-surface rounded-lg-card border border-danger/30 shadow-card animate-scaleIn overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-danger/60 to-transparent" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-sm-tag hover:bg-bg-card transition-colors text-text-tertiary hover:text-text-primary"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
        
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)' }}>
            <svg className="w-8 h-8 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/>
              <path d="M12 17h.01"/>
            </svg>
          </div>
          
          <h3 className="font-display text-lg text-text-primary mb-3 tracking-wider">检测失败</h3>
          <p className="text-text-secondary font-body">{message}</p>
          
          <button
            onClick={onClose}
            className="mt-8 px-8 py-3 rounded-lg-card bg-danger text-text-primary font-body hover:bg-danger/90 transition-colors"
            style={{ boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)' }}
          >
            关闭
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
