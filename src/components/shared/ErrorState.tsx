'use client';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = 'Signal lost. Please try again.',
  onRetry
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6">
      {/* Static TV icon */}
      <div className="relative w-24 h-20 mb-6 bg-gray-800 rounded border-4 border-gray-600">
        {/* Static noise pattern */}
        <div
          className="absolute inset-1 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '64px 64px',
          }}
        />
        {/* Antenna */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-4">
          <div className="w-1 h-6 bg-gray-500 transform -rotate-12 origin-bottom" />
          <div className="w-1 h-6 bg-gray-500 transform rotate-12 origin-bottom" />
        </div>
      </div>

      {/* Error message */}
      <p className="text-red-500 text-xl font-mono mb-2">NO SIGNAL</p>
      <p className="text-gray-500 text-sm mb-6">{message}</p>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="retro-button text-xs"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
