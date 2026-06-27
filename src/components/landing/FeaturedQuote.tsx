import { siteConfig } from '@/config/Site';

export default function FeaturedQuote() {
  const { text, author } = siteConfig.quote;

  return (
    <div className="flex min-w-0 flex-1 items-start gap-3">
      <svg
        aria-hidden
        width="20"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-subtle mt-0.5 shrink-0"
      >
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.45l.813 1.28C6.667 7.018 5.5 9.466 5.5 12.011c0 1.489.39 2.489 1.083 3.321C4.583 17.321 4.583 17.321 4.583 17.321zm13 0c-1.03-1.094-1.583-2.321-1.583-4.31 0-3.5 2.457-6.637 6.03-8.45l.813 1.28c-2.676 1.177-3.843 3.625-3.843 6.17 0 1.489.39 2.489 1.083 3.321z" />
      </svg>
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
        <p className="text-primary text-[13px] leading-relaxed font-medium sm:text-[14px]">
          &ldquo;{text}&rdquo;
        </p>
        <p className="text-muted shrink-0 text-[12px] sm:text-[13px]">
          — {author}
        </p>
      </div>
    </div>
  );
}
