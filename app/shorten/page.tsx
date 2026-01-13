import type { Metadata } from 'next'
import { ShortenPageContent } from './ShortenPageContent'

export const metadata: Metadata = {
  title: 'URL Shortener - Create Short Links Instantly',
  description: 'Shorten your long URLs into memorable, shareable links. Get detailed analytics, custom aliases, and QR codes for all your shortened links.',
  keywords: ['URL shortener', 'short links', 'link management', 'custom aliases', 'QR codes'],
}

export default function ShortenPage() {
  return <ShortenPageContent />
}