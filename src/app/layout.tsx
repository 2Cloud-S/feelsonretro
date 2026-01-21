import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FeelsOnRetro - Your Retro News Experience',
  description: 'A retro-styled news reader with TV channel switching and newspaper views. Read news like its the golden age of television.',
  keywords: ['news', 'retro', 'TV', 'newspaper', 'reader', 'feelsonretro', 'rss', 'news aggregator'],
  authors: [{ name: 'FeelsOnRetro' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'FeelsOnRetro',
    description: 'Experience news the retro way - TV channel switching meets classic newspaper layout',
    type: 'website',
    siteName: 'FeelsOnRetro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FeelsOnRetro',
    description: 'Experience news the retro way',
  },
};

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
