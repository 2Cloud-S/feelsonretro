'use client';

interface StaticNoiseProps {
  isVisible: boolean;
}

export default function StaticNoise({ isVisible }: StaticNoiseProps) {
  if (!isVisible) return null;

  return (
    <div className="static-noise" aria-hidden="true">
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
