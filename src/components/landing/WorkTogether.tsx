import ContactForm from '@/components/contact/ContactForm';
import { siteConfig } from '@/config/Site';
import Link from 'next/link';

import Container from '../common/Container';
import FadeIn from '../common/FadeIn';
import FeaturedQuote from './FeaturedQuote';
import VisitorCounter from './VisitorCounter';

function ExternalLinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-subtle shrink-0 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-400"
      aria-hidden
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

const contactOptions = [
  {
    href: siteConfig.calLink,
    external: true,
    show: true,
    title: 'Schedule a Free Call',
    subtitle: '30-minute strategy session',
    filled: false,
    icon: (
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </>
    ),
  },
  {
    href: `mailto:${siteConfig.email}`,
    external: false,
    show: true,
    title: siteConfig.email,
    subtitle: 'Quick inquiries & questions',
    filled: false,
    icon: (
      <>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
  },
  {
    href: siteConfig.social.twitter,
    external: true,
    show: true,
    title: 'Connect on X',
    subtitle: 'Follow for updates & insights',
    filled: true,
    icon: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
  },
];

export default function WorkTogether() {
  return (
    <Container className="mt-24 pb-12" id="contact">
      <FadeIn>
        <p className="section-kicker mb-8">Let&apos;s Work Together</p>
      </FadeIn>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <FadeIn delay={0.06}>
          <div className="work-card flex h-full flex-col">
            <div className="mb-6 space-y-1">
              <h3 className="text-primary text-[15px] font-semibold sm:text-base">
                Get in Touch
              </h3>
              <p className="text-secondary text-[13px] sm:text-[13.5px]">
                Choose your preferred method to connect and let&apos;s discuss
                your project.
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-2.5">
              {contactOptions
                .filter((option) => option.show)
                .map((option) => (
                  <Link
                    key={option.title}
                    href={option.href}
                    target={option.external ? '_blank' : undefined}
                    rel={option.external ? 'noopener noreferrer' : undefined}
                    className="contact-row group"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={option.filled ? 'currentColor' : 'none'}
                      stroke={option.filled ? undefined : 'currentColor'}
                      strokeWidth={option.filled ? undefined : 1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-icon shrink-0"
                    >
                      {option.icon}
                    </svg>
                    <div className="min-w-0 flex-1">
                      <span className="text-primary block truncate text-[14px] font-medium">
                        {option.title}
                      </span>
                      <p className="text-muted text-[12px]">
                        {option.subtitle}
                      </p>
                    </div>
                    <ExternalLinkIcon />
                  </Link>
                ))}
            </div>

            <div className="text-muted mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-200 pt-5 text-[11px] dark:border-zinc-800">
              <div className="flex items-center gap-1.5">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-subtle"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Replies within 24 hours
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-subtle"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
                Open to remote, freelance & full-time
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="work-card flex h-full flex-col">
            <div className="mb-6 space-y-1">
              <h3 className="text-primary text-[15px] font-semibold sm:text-base">
                Send a Message
              </h3>
              <p className="text-secondary text-[13px] sm:text-[13.5px]">
                Prefer to write? Fill out the form and I&apos;ll get back to you
                within 24 hours.
              </p>
            </div>
            <ContactForm variant="embedded" />
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.18} className="mt-10">
        <div className="work-card flex flex-col items-stretch gap-6 sm:flex-row sm:items-center">
          <FeaturedQuote />
          <div
            aria-hidden
            className="hidden h-10 w-px shrink-0 bg-zinc-200 sm:block dark:bg-zinc-800"
          />
          <VisitorCounter className="text-muted shrink-0 text-[12px] sm:text-[13px]" />
        </div>
      </FadeIn>
    </Container>
  );
}
