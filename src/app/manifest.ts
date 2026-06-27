import { siteConfig } from '@/config/Site';
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Portfolio`,
    short_name: siteConfig.name.split(' ')[0],
    description: siteConfig.bio,
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: '/assets/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
