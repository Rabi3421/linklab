import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo/site';

const appUrl = siteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard',
        '/my-links',
        '/settings',
        '/create-link',
        '/link-analytics',
        '/admin',
        '/api-keys',
      ],
    },
    sitemap: `${appUrl}/sitemap.xml`,
    host: appUrl,
  };
}
