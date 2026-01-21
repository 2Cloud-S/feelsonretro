'use client';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Tuning in...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
      {/* Retro loading animation */}
      <div className="relative w-16 h-16 mb-4">
        {/* Spinning ring */}
        <div className="absolute inset-0 border-4 border-gray-700 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full animate-spin" />

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Loading text */}
      <p className="text-green-500 text-lg font-mono animate-pulse">
        {message}
      </p>

      {/* Retro dots animation */}
      <div className="flex gap-1 mt-2">
        <span className="w-2 h-2 bg-green-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-green-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-green-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
