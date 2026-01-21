'use client';

import { useCurrentChannel, useAllChannels, useIsPoweredOn } from '@/store';

export default function ChannelDisplay() {
  const currentChannel = useCurrentChannel();
  const allChannels = useAllChannels();
  const isPoweredOn = useIsPoweredOn();

  const channelConfig = allChannels.find((c) => c.number === currentChannel);

  if (!isPoweredOn) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 z-20 text-right">
      {/* Channel Number */}
      <div className="channel-display text-4xl font-bold">
        CH {String(currentChannel).padStart(2, '0')}
      </div>

      {/* Channel Name */}
      {channelConfig && (
        <div
          className="text-sm mt-1 font-mono tracking-wider opacity-80"
          style={{ color: channelConfig.color }}
        >
          {channelConfig.shortName}
        </div>
      )}
    </div>
  );
}
