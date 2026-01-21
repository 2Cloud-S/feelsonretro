'use client';

export default function Masthead() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate a pseudo "volume" and "number" based on date
  const startDate = new Date('2024-01-01');
  const daysSinceStart = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const volume = Math.floor(daysSinceStart / 365) + 1;
  const number = (daysSinceStart % 365) + 1;

  return (
    <header className="newspaper-masthead">
      {/* Top line with price and weather */}
      <div className="flex justify-between text-xs mb-2">
        <span>Price: Free</span>
        <span>Weather: Check Your Window</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl md:text-6xl font-serif tracking-wide">
        FeelsOnRetro
      </h1>

      {/* Subtitle */}
      <p className="text-sm italic mt-2 text-gray-700">
        Your Retro Window to the World
      </p>

      {/* Date Line */}
      <div className="newspaper-dateline mt-4">
        <span>Vol. {volume} No. {number}</span>
        <span>{formattedDate}</span>
        <span>Digital Edition</span>
      </div>
    </header>
  );
}
