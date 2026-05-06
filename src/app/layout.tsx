import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';
import { AuthProvider } from '@/contexts/AuthContext';
import GoogleAnalytics from '@/components/common/GoogleAnalytics';
import { defaultOgImage, siteUrl } from '@/lib/seo/site';

const appUrl = siteUrl;
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
    template: '%s',
  },
  description:
    'LinkLab helps teams shorten URLs, create branded links, generate QR codes, track clicks, manage custom domains, and run link workflows from one platform.',
  applicationName: 'LinkLab',
  category: 'technology',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
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
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'LinkLab URL shortener, branded links, QR codes, and analytics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkLab | URL Shortener, Branded Links & QR Code Analytics',
    description:
      'Shorten URLs, create branded links, generate QR codes, and track clicks with LinkLab.',
    images: [defaultOgImage],
  },
  verification: {
    google: googleSiteVerification,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '64x64' },
      { url: '/icon', type: 'image/png', sizes: '512x512' },
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
        <GoogleAnalytics />
        <AuthProvider>{children}</AuthProvider>

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Flinklab7067back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.17" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" />
      </body>
    </html>
  );
}
