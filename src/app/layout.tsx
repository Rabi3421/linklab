import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';
import { AuthProvider } from '@/contexts/AuthContext';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.linklab.in';
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e2129',
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'LinkLab | URL Shortener, Branded Links & QR Code Analytics',
    template: '%s | LinkLab',
  },
  description:
    'LinkLab helps teams shorten URLs, create branded links, generate QR codes, track clicks, manage custom domains, and run link workflows from one platform.',
  applicationName: 'LinkLab',
  category: 'technology',
  keywords: [
    'linklab',
    'url shortener',
    'link shortener',
    'branded links',
    'qr code analytics',
    'short link analytics',
    'custom domains',
    'link management',
  ],
  openGraph: {
    type: 'website',
    url: appUrl,
    siteName: 'LinkLab',
    title: 'LinkLab | URL Shortener, Branded Links & QR Code Analytics',
    description:
      'Shorten URLs, create branded links, generate QR codes, and track clicks with LinkLab.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkLab | URL Shortener, Branded Links & QR Code Analytics',
    description:
      'Shorten URLs, create branded links, generate QR codes, and track clicks with LinkLab.',
  },
  verification: {
    google: googleSiteVerification,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: 'any' },
      { url: '/icon', type: 'image/png', sizes: '192x192' }
    ],
    apple: [{ url: '/apple-icon', type: 'image/png', sizes: '180x180' }],
    shortcut: ['/favicon.ico'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>{children}</AuthProvider>

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Flinklab7067back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.17" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" />
      </body>
    </html>
  );
}
