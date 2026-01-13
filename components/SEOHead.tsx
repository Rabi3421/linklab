import * as React from 'react'
import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  canonicalUrl?: string
  noindex?: boolean
}

export function SEOHead({
  title,
  description,
  keywords = [],
  ogImage,
  ogType = 'website',
  canonicalUrl,
  noindex = false
}: SEOHeadProps) {
  const baseTitle = 'LinkLab - All Your URL Tools. One Powerful Platform.'
  const baseDescription = 'LinkLab is your one-stop solution for everything related to URLs. Shorten links, generate QR codes, build UTM parameters, and more.'
  const baseUrl = 'https://linklab.com'
  
  const seo = {
    title: title ? `${title} | LinkLab` : baseTitle,
    description: description || baseDescription,
    keywords: [...keywords, 'URL shortener', 'link management', 'QR code generator', 'UTM builder', 'link analytics'],
    ogImage: ogImage || `${baseUrl}/og-image.png`,
    canonicalUrl: canonicalUrl || baseUrl,
  }

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      <meta name="author" content="LinkLab Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seo.canonicalUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.ogImage} />
      <meta property="og:site_name" content="LinkLab" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.canonicalUrl} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.ogImage} />
      <meta name="twitter:creator" content="@linklab" />
      
      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      
      {/* Theme */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="color-scheme" content="light dark" />
    </Head>
  )
}