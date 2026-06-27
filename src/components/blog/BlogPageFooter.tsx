'use client';

import VisitorCounter from '@/components/landing/VisitorCounter';
import { siteConfig } from '@/config/Site';

export default function BlogPageFooter() {
  return (
    <footer className="absolute inset-x-0 bottom-0 px-6 pb-8 lg:px-0">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start justify-between gap-4 text-[12px] text-zinc-500 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <p>
            Designed &amp; Developed by{' '}
            <span className="text-zinc-400">
              {siteConfig.name.split(' ')[0]}
            </span>
          </p>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
        <div className="space-y-1 sm:text-right">
          <VisitorCounter
            variant="hash"
            className="text-[12px] text-zinc-500"
          />
          <p>{siteConfig.location}</p>
        </div>
      </div>
    </footer>
  );
}
