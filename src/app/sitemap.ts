import type { MetadataRoute } from 'next';
import { blogPosts } from './blog/data';
import { seoLandingPages } from '@/lib/seo/landing-pages';
import { siteUrl } from '@/lib/seo/site';

const appUrl = siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${appUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${appUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${appUrl}/qr-code-generator`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${appUrl}/barcode-generator`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${appUrl}/developers`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${appUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${appUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.55,
    },
    {
      url: `${appUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const seoLandingRoutes: MetadataRoute.Sitemap = seoLandingPages.map((page) => ({
    url: `${appUrl}/${page.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: page.slug === 'free-url-shortener' ? 0.92 : 0.86,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${appUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...seoLandingRoutes, ...blogRoutes];
}
