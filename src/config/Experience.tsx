import Figma from '@/components/technologies/Figma';
import Git from '@/components/technologies/Github';
import MongoDB from '@/components/technologies/MongoDB';
import NextJs from '@/components/technologies/NextJs';
import NodeJs from '@/components/technologies/NodeJs';
import ReactIcon from '@/components/technologies/ReactIcon';
import TailwindCss from '@/components/technologies/TailwindCss';
import TypeScript from '@/components/technologies/TypeScript';

export interface Technology {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  image?: string;
  description: string[];
  startDate: string;
  endDate: string;
  website?: string;
  technologies: Technology[];
  isCurrent: boolean;
}

export const experiences: Experience[] = [
  {
    isCurrent: true,
    company: 'StackKinetix Studio',
    position: 'Founder & Developer',
    location: 'Remote, Full-Time',
    image: '/project/stackkinetix-studio.png',
    description: [
      'Founded and building StackKinetix, delivering AI agents, workflow automation, and modern web apps that help businesses save 20+ hours per week.',
    ],
    startDate: 'Mar 2026',
    endDate: 'Present',
    website: 'https://stackkinetix.vercel.app/',
    technologies: [
      { name: 'Next.js', href: 'https://nextjs.org/', icon: <NextJs /> },
      { name: 'React', href: 'https://react.dev/', icon: <ReactIcon /> },
      { name: 'Node.js', href: 'https://nodejs.org/', icon: <NodeJs /> },
      {
        name: 'Tailwind CSS',
        href: 'https://tailwindcss.com/',
        icon: <TailwindCss />,
      },
      {
        name: 'TypeScript',
        href: 'https://typescriptlang.org/',
        icon: <TypeScript />,
      },
      { name: 'Figma', href: 'https://figma.com/', icon: <Figma /> },
      { name: 'MongoDB', href: 'https://mongodb.com/', icon: <MongoDB /> },
      { name: 'Git', href: 'https://git-scm.com/', icon: <Git /> },
    ],
  },
];

export interface FeaturedProject {
  title: string;
  description: string;
  image: string;
  live?: string;
  github?: string;
  technologies: Technology[];
}

export const featuredProjects: FeaturedProject[] = [
  {
    title: 'StackKinetix Studio',
    description:
      'We build AI systems that move — custom agents, intelligent workflows, and digital experiences that save teams 20+ hours every week.',
    image: '/project/stackkinetix-studio.png',
    live: 'https://stackkinetix.vercel.app/',
    technologies: [
      { name: 'Next.js', href: 'https://nextjs.org/', icon: <NextJs /> },
      { name: 'React', href: 'https://react.dev/', icon: <ReactIcon /> },
      {
        name: 'Tailwind CSS',
        href: 'https://tailwindcss.com/',
        icon: <TailwindCss />,
      },
      { name: 'Node.js', href: 'https://nodejs.org/', icon: <NodeJs /> },
    ],
  },
  {
    title: 'Presently',
    description:
      'A modern attendance platform featuring QR-based check-ins, GPS validation, analytics dashboards, and seamless student–faculty workflows.',
    image: '/project/presently.png',
    live: 'https://presently.app',
    technologies: [
      { name: 'Next.js', href: 'https://nextjs.org/', icon: <NextJs /> },
      { name: 'React', href: 'https://react.dev/', icon: <ReactIcon /> },
      {
        name: 'Tailwind CSS',
        href: 'https://tailwindcss.com/',
        icon: <TailwindCss />,
      },
      {
        name: 'TypeScript',
        href: 'https://typescriptlang.org/',
        icon: <TypeScript />,
      },
      { name: 'MongoDB', href: 'https://mongodb.com/', icon: <MongoDB /> },
    ],
  },
];
