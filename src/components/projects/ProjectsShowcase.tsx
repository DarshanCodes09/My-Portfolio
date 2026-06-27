'use client';

import { type Project } from '@/types/project';

import { ProjectShowcaseCard } from './ProjectShowcaseCard';

type ProjectsShowcaseProps = {
  projects: Project[];
};

export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  if (projects.length === 0) {
    return (
      <p className="py-16 text-center text-zinc-500">
        No projects to show yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {projects.map((project, index) => (
        <ProjectShowcaseCard
          key={project.title}
          project={project}
          index={index}
        />
      ))}
    </div>
  );
}
