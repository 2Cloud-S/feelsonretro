'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  useStore,
  useSettings,
  useCustomChannels,
  useAllChannels,
} from '@/store';
import { Theme, FontSize } from '@/types';

export default function SettingsPage() {
  const settings = useSettings();
  const customChannels = useCustomChannels();
  const allChannels = useAllChannels();
  const { updateSettings, addCustomChannel, removeCustomChannel } = useStore();

  // Form state for adding custom channel
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelUrl, setNewChannelUrl] = useState('');
  const [addError, setAddError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!newChannelName.trim() || !newChannelUrl.trim()) {
      setAddError('Please fill in both fields');
      return;
    }

    // Basic URL validation
    try {
      new URL(newChannelUrl);
    } catch {
      setAddError('Please enter a valid URL');
      return;
    }

    setIsValidating(true);

    try {
      // Try to fetch the feed to validate it
      const response = await fetch(
        `/api/news/custom-test?url=${encodeURIComponent(newChannelUrl)}`
      );

      if (!response.ok) {
        throw new Error('Invalid RSS feed');
      }

      addCustomChannel(newChannelName, newChannelUrl);
      setNewChannelName('');
      setNewChannelUrl('');
    } catch {
      setAddError('Could not validate RSS feed. Please check the URL.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-green-500">Settings</h1>
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Back to TV
          </Link>
        </div>

        {/* View Preferences */}
        <section className="mb-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-green-400">
            View Preferences
          </h2>

          {/* Default View Mode */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Default View
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => updateSettings({ viewMode: 'tv' })}
                className={`px-4 py-2 rounded ${
                  settings.viewMode === 'tv'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                TV Mode
              </button>
              <button
                onClick={() => updateSettings({ viewMode: 'newspaper' })}
                className={`px-4 py-2 rounded ${
                  settings.viewMode === 'newspaper'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Newspaper
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              TV Theme
            </label>
            <div className="flex gap-4">
              {(['color', 'green', 'amber'] as Theme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => updateSettings({ theme })}
                  className={`px-4 py-2 rounded capitalize ${
                    settings.theme === theme
                      ? theme === 'color'
                        ? 'bg-blue-600'
                        : theme === 'green'
                        ? 'bg-green-600'
                        : 'bg-amber-600'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {theme === 'color' ? 'Color TV' : `CRT ${theme}`}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Font Size
            </label>
            <div className="flex gap-4">
              {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => updateSettings({ fontSize: size })}
                  className={`px-4 py-2 rounded capitalize ${
                    settings.fontSize === size
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* TV Mode Settings */}
        <section className="mb-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-green-400">
            TV Mode Settings
          </h2>

          {/* Sound Effects */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium">Sound Effects</label>
              <p className="text-xs text-gray-500">
                Channel click and static sounds
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({ soundEnabled: !settings.soundEnabled })
              }
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Sound Volume */}
          {settings.soundEnabled && (
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Volume: {Math.round(settings.soundVolume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.soundVolume * 100}
                onChange={(e) =>
                  updateSettings({ soundVolume: Number(e.target.value) / 100 })
                }
                className="w-full"
              />
            </div>
          )}

          {/* Scanline Intensity */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Scanline Intensity: {settings.scanlineIntensity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.scanlineIntensity}
              onChange={(e) =>
                updateSettings({ scanlineIntensity: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>

          {/* Flicker Effect */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium">Screen Flicker</label>
              <p className="text-xs text-gray-500">Subtle CRT flicker effect</p>
            </div>
            <button
              onClick={() =>
                updateSettings({ flickerEnabled: !settings.flickerEnabled })
              }
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.flickerEnabled ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.flickerEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Custom Channels */}
        <section className="mb-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-green-400">
            Custom RSS Channels
          </h2>

          {/* Add new channel form */}
          <form onSubmit={handleAddChannel} className="mb-6">
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="e.g., Tech Crunch"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  RSS Feed URL
                </label>
                <input
                  type="url"
                  value={newChannelUrl}
                  onChange={(e) => setNewChannelUrl(e.target.value)}
                  placeholder="https://example.com/feed.xml"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            {addError && (
              <p className="text-red-500 text-sm mb-4">{addError}</p>
            )}

            <button
              type="submit"
              disabled={isValidating}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-white transition-colors"
            >
              {isValidating ? 'Validating...' : 'Add Channel'}
            </button>
          </form>

          {/* List of custom channels */}
          {customChannels.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm text-gray-400 mb-2">Your Channels</h3>
              {customChannels.map((channel) => (
                <div
                  key={channel.number}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded"
                >
                  <div>
                    <p className="font-medium">
                      CH {channel.number}: {channel.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {channel.customUrl}
                    </p>
                  </div>
                  <button
                    onClick={() => removeCustomChannel(channel.number)}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No custom channels added yet. Add your favorite RSS feeds above!
            </p>
          )}
        </section>

        {/* Accessibility */}
        <section className="mb-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-green-400">
            Accessibility
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium">Reduce Motion</label>
              <p className="text-xs text-gray-500">
                Disable animations for accessibility
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({ reducedMotion: !settings.reducedMotion })
              }
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.reducedMotion ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Channel List */}
        <section className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-green-400">
            All Channels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {allChannels.map((channel) => (
              <div
                key={channel.number}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
              >
                <span
                  className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: channel.color, color: '#fff' }}
                >
                  {channel.number}
                </span>
                <div>
                  <p className="text-sm font-medium">{channel.shortName}</p>
                  <p className="text-xs text-gray-500">{channel.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
