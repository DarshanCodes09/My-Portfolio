import { siteConfig } from './Site';

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

export const pageMetadata: Record<string, PageMeta> = {
  '/': {
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: `${siteConfig.bio} Explore my projects, experience, and technical work.`,
    keywords: [...siteConfig.keywords, 'projects', 'experience'],
    ogImage: siteConfig.ogImage,
    twitterCard: 'summary_large_image',
  },
  '/contact': {
    title: `Contact — ${siteConfig.name}`,
    description:
      "Get in touch for collaborations, freelance work, or full-time opportunities. I'd love to hear from you.",
    keywords: ['contact', 'hire', 'collaboration', 'freelance'],
    ogImage: siteConfig.ogImage,
    twitterCard: 'summary',
  },
  '/work-experience': {
    title: `Work Experience — ${siteConfig.name}`,
    description:
      'Professional journey across software development roles, startups, and product engineering.',
    keywords: ['work experience', 'career', 'software developer'],
    ogImage: siteConfig.ogImage,
    twitterCard: 'summary_large_image',
  },
  '/projects': {
    title: `Projects — ${siteConfig.name}`,
    description:
      'Selected projects including StackKinetix Studio and Presently — AI automation, attendance platforms, and full-stack web apps.',
    keywords: ['projects', 'portfolio', 'StackKinetix', 'Presently'],
    ogImage: siteConfig.ogImage,
    twitterCard: 'summary_large_image',
  },
  '/blog': {
    title: `Blog — ${siteConfig.name}`,
    description:
      'Writing on engineering, product development, and building software.',
    keywords: ['blog', 'engineering', 'web development'],
    ogImage: siteConfig.ogImage,
    twitterCard: 'summary_large_image',
  },
  '/resume': {
    title: `Resume — ${siteConfig.name}`,
    description: `Professional resume and CV for ${siteConfig.name}. Skills, experience, and qualifications.`,
    keywords: ['resume', 'cv', 'hire'],
    ogImage: siteConfig.ogImage,
    twitterCard: 'summary',
  },
  '/gears': {
    title: `Gears & Tools — ${siteConfig.name}`,
    description:
      'Devices, extensions, and software I use for development and productivity.',
    keywords: ['setup', 'tools', 'developer environment'],
    ogImage: siteConfig.ogImage,
    twitterCard: 'summary_large_image',
  },
  '/setup': {
    title: `VS Code Setup — ${siteConfig.name}`,
    description:
      'My VS Code configuration, extensions, and fonts for a productive dev environment.',
    keywords: ['vscode', 'setup', 'extensions'],
    ogImage: siteConfig.ogImage,
    twitterCard: 'summary_large_image',
  },
  '/journey/certificates': {
    title: `Certificates — ${siteConfig.name}`,
    description:
      'Certifications and achievements in software development and computer science.',
    keywords: ['certificates', 'achievements', 'learning'],
    ogImage: siteConfig.ogImage,
    twitterCard: 'summary',
  },
};

export function getPageMetadata(pathname: string): PageMeta {
  return pageMetadata[pathname] ?? pageMetadata['/'];
}

export function generateMetadata(pathname: string) {
  const pageMeta = getPageMetadata(pathname);

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageMeta.title,
    description: pageMeta.description,
    keywords: pageMeta.keywords?.join(', '),
    authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `${siteConfig.url}${pathname === '/' ? '' : pathname}`,
      title: pageMeta.title,
      description: pageMeta.description,
      siteName: siteConfig.name,
      images: [
        {
          url: pageMeta.ogImage ?? siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${pageMeta.title}`,
        },
      ],
    },
    twitter: {
      card: pageMeta.twitterCard ?? 'summary_large_image',
      title: pageMeta.title,
      description: pageMeta.description,
      creator: siteConfig.author.twitter,
      site: siteConfig.author.twitter,
      images: [pageMeta.ogImage ?? siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${siteConfig.url}${pathname === '/' ? '' : pathname}`,
    },
  };
}

export function getStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    jobTitle: siteConfig.title,
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
      siteConfig.social.medium,
    ],
    image: `${siteConfig.url}${siteConfig.avatar}`,
    description: siteConfig.bio,
  };
}
