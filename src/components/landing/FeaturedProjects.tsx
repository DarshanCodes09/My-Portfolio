import { featuredProjects } from '@/config/Experience';
import Image from 'next/image';
import Link from 'next/link';

import Container from '../common/Container';
import FadeIn from '../common/FadeIn';
import TechIconRow from '../common/TechIconRow';

export default function FeaturedProjects() {
  return (
    <Container className="mt-16">
      <FadeIn>
        <div className="section-kicker mb-6">Featured Projects</div>
      </FadeIn>
      <div className="grid gap-6 sm:grid-cols-2">
        {featuredProjects.map((project, index) => (
          <FadeIn key={project.title} delay={index * 0.08}>
            <article className="siddz-card group overflow-hidden transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${project.title} - Project by Darshan Kushalkar`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="space-y-3 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-primary text-[15px] font-semibold sm:text-base">
                    {project.title}
                  </h3>
                  <div className="flex shrink-0 items-center gap-2">
                    {project.github && (
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} GitHub`}
                        className="text-icon transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </Link>
                    )}
                    {project.live && (
                      <Link
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} live site`}
                        className="text-icon transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                          <path d="M2 12h20" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
                <p className="text-secondary text-[13px] leading-relaxed sm:text-[13.5px]">
                  {project.description}
                </p>
                <TechIconRow technologies={project.technologies} />
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </Container>
  );
}
