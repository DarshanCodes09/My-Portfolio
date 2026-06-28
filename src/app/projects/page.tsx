import Container from '@/components/common/Container';
import { ProjectsShowcase } from '@/components/projects/ProjectsShowcase';
import { generateMetadata as getMetadata } from '@/config/Meta';
import { projects } from '@/config/Projects';
import { Metadata } from 'next';

export const metadata: Metadata = {
  ...getMetadata('/projects'),
};

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,120,120,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,120,120,0.12),transparent)]"
      />

      <Container className="relative !max-w-4xl py-16 sm:py-20">
        <header className="mb-14 space-y-4 sm:mb-16">
          <h1 className="section-title text-4xl sm:text-5xl">Projects</h1>
          <p className="text-secondary max-w-xl text-[15px] leading-relaxed sm:text-base">
            A curated collection of products and platforms I&apos;ve designed
            and built — from AI automation studios to full-stack web
            applications.
          </p>
          <div className="h-px w-full max-w-xs bg-gradient-to-r from-zinc-300 to-transparent dark:from-zinc-700" />
        </header>

        <ProjectsShowcase projects={projects} />
      </Container>
    </div>
  );
}
