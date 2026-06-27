'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { siteConfig } from '@/config/Site';
import Link from 'next/link';

type SocialLink = {
  label: string;
  href: string;
  fill?: boolean;
  icon: React.ReactNode;
};

const socialLinks: SocialLink[] = [
  {
    label: 'GitHub',
    href: siteConfig.social.github,
    fill: true,
    icon: (
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    ),
  },
  {
    label: 'X (Twitter)',
    href: siteConfig.social.twitter,
    fill: true,
    icon: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
  },
  {
    label: 'LinkedIn',
    href: siteConfig.social.linkedin,
    fill: true,
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 4.126 0 2.063 2.063 0 0 1-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
  {
    label: 'Email',
    href: siteConfig.social.email,
    fill: false,
    icon: (
      <>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
  },
  {
    label: 'Medium',
    href: siteConfig.social.medium,
    fill: true,
    icon: (
      <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zm3.39 0c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75 1.19 2.58 1.19 5.75z" />
    ),
  },
];

export default function SocialLinks() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-4">
        {socialLinks.map((social) => (
          <Tooltip key={social.label}>
            <TooltipTrigger asChild>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-icon transition-colors duration-150 hover:text-zinc-900 dark:hover:text-[#f0f0f0]"
                href={social.href}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={social.fill ? 'currentColor' : 'none'}
                  stroke={social.fill ? undefined : 'currentColor'}
                  strokeWidth={social.fill ? undefined : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {social.icon}
                </svg>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              sideOffset={6}
              className="border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 [&>svg]:hidden"
            >
              {social.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
