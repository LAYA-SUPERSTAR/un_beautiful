interface ImageComparisonSliderProps {
  originalImage: string;
  processedImage: string;
}

export function ImageComparisonSlider({ originalImage, processedImage }: ImageComparisonSliderProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2 text-pink-400 font-orbitron text-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>原图</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400 font-orbitron text-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><circle cx="12" cy="12" r="3"/><path d="M21 12l-4.64-4.64"/><path d="M16.36 16.36 21 21"/><path d="M12 21a9 9 0 0 0 9-9"/><path d="M12 21a9 9 0 0 1-9-9"/></svg>
          <span>AI 还原</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative rounded-xl overflow-hidden border border-pink-500/30 bg-gradient-to-br from-pink-900/20 to-purple-900/20">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none z-10" />
          <img
            src={originalImage}
            alt="原图"
            className="w-full h-80 md:h-96 object-contain"
          />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500" />
        </div>

        <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none z-10" />
          <img
            src={processedImage}
            alt="AI 还原"
            className="w-full h-80 md:h-96 object-contain"
          />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-500 text-sm font-rajdhani">
          左右对比原图和 AI 还原效果
        </p>
      </div>
    </div>
  );
}
