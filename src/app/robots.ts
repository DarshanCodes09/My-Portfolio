import { siteConfig } from '@/config/Site';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/spotify-setup'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
