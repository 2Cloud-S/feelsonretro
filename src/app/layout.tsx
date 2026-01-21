import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FeelsOnRetro - Your Retro News Experience',
  description: 'A retro-styled news reader with TV channel switching and newspaper views',
  keywords: ['news', 'retro', 'TV', 'newspaper', 'reader', 'feelsonretro'],
  authors: [{ name: 'FeelsOnRetro' }],
  openGraph: {
    title: 'FeelsOnRetro',
    description: 'Experience news the retro way',
    type: 'website',
  },
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
