import { siteConfig } from '@/config/Site';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/projects',
    '/blog',
    '/contact',
    '/work-experience',
    '/resume',
    '/gears',
    '/setup',
    '/journey/certificates',
  ];

  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteConfig.url}${route === '/' ? '' : route}`,
    lastModified,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
