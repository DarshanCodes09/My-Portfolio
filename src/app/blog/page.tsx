import BlogPageFooter from '@/components/blog/BlogPageFooter';
import FadeIn from '@/components/common/FadeIn';
import { generateMetadata as getMetadata } from '@/config/Meta';

export const metadata = getMetadata('/blog');

export default function BlogPage() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col">
      <section className="flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-32 text-center md:pt-28">
        <FadeIn className="max-w-2xl">
          <h1 className="font-hanken-grotesk-italic text-primary text-[2.5rem] leading-tight font-medium tracking-tight sm:text-5xl md:text-[3.25rem]">
            Writing &amp; Thoughts #
          </h1>
          <p className="text-secondary mx-auto mt-5 max-w-md text-[14px] leading-relaxed sm:text-[15px]">
            I write about engineering, design, and everything in between.
          </p>
        </FadeIn>

        <FadeIn delay={0.12} className="mt-16">
          <p className="text-primary text-[15px] font-semibold tracking-wide sm:text-base">
            Coming Soon...
          </p>
        </FadeIn>
      </section>

      <BlogPageFooter />
    </main>
  );
}
