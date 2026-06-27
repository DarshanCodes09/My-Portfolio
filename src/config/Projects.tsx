import MongoDB from '@/components/technologies/MongoDB';
import NextJs from '@/components/technologies/NextJs';
import NodeJs from '@/components/technologies/NodeJs';
import ReactIcon from '@/components/technologies/ReactIcon';
import TailwindCss from '@/components/technologies/TailwindCss';
import TypeScript from '@/components/technologies/TypeScript';
import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    title: 'StackKinetix Studio',
    description:
      'We build AI systems that move — custom agents, intelligent workflows, and digital experiences that save teams 20+ hours every week.',
    image: '/project/stackkinetix-studio.png',
    link: 'https://stackkinetix.vercel.app/',
    technologies: [
      { name: 'Next.js', icon: <NextJs key="nextjs" /> },
      { name: 'React', icon: <ReactIcon key="react" /> },
      { name: 'Tailwind CSS', icon: <TailwindCss key="tailwindcss" /> },
      { name: 'Node.js', icon: <NodeJs key="nodejs" /> },
    ],
    live: 'https://stackkinetix.vercel.app/',
    details: false,
    projectDetailsPageSlug: '/projects/stackkinetix-studio',
    isWorking: true,
  },
  {
    title: 'Presently',
    description:
      'A modern attendance platform featuring QR-based check-ins, GPS validation, analytics dashboards, and seamless student–faculty workflows.',
    image: '/project/presently.png',
    link: 'https://presently.app',
    technologies: [
      { name: 'Next.js', icon: <NextJs key="nextjs" /> },
      { name: 'React', icon: <ReactIcon key="react" /> },
      { name: 'Tailwind CSS', icon: <TailwindCss key="tailwindcss" /> },
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'MongoDB', icon: <MongoDB key="mongodb" /> },
    ],
    live: 'https://presently.app',
    details: false,
    projectDetailsPageSlug: '/projects/presently',
    isWorking: true,
  },
];
