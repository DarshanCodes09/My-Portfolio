import { experiences } from '@/config/Experience';
import Link from 'next/link';

import Container from '../common/Container';
import FadeIn from '../common/FadeIn';
import TechIconRow from '../common/TechIconRow';

export default function Experience() {
  return (
    <Container className="mt-16">
      <FadeIn>
        <div className="section-kicker mb-6">Experience</div>
      </FadeIn>
      <div className="relative">
        <div className="absolute top-2 bottom-2 left-[7px] w-px bg-zinc-200 dark:bg-zinc-800" />

        <div className="flex flex-col gap-10">
          {experiences.map((exp, index) => (
            <FadeIn key={exp.company} delay={index * 0.08}>
              <div className="relative pl-8">
                <div
                  className={`absolute top-[6px] left-0 size-[15px] rounded-full border-[3px] ${
                    exp.isCurrent
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900'
                  }`}
                />

                <div className="space-y-3">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-primary text-[15px] font-semibold sm:text-base">
                          {exp.position}
                        </h3>
                        <span className="text-subtle">·</span>
                        {exp.website ? (
                          <Link
                            href={exp.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary text-[14px] underline-offset-2 transition-colors hover:text-zinc-900 hover:underline dark:hover:text-zinc-200"
                          >
                            {exp.company}
                          </Link>
                        ) : (
                          <span className="text-secondary text-[14px]">
                            {exp.company}
                          </span>
                        )}
                      </div>
                      <p className="text-muted mt-0.5 text-[12px] sm:text-[13px]">
                        {exp.location}
                      </p>
                    </div>
                    <div className="text-muted shrink-0 text-[12px] sm:text-right sm:text-[13px]">
                      {exp.startDate} —{' '}
                      {exp.isCurrent ? 'Present' : exp.endDate}
                    </div>
                  </div>

                  <div className="text-secondary space-y-1.5 text-[13px] leading-[1.8] sm:text-[13.5px]">
                    {exp.description.map((line, i) => (
                      <p key={i}>
                        {i > 0 && exp.description.length > 1
                          ? `· ${line}`
                          : line}
                      </p>
                    ))}
                  </div>

                  <TechIconRow technologies={exp.technologies} />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Container>
  );
}
