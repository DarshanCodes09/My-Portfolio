'use client';

import { type Project } from '@/types/project';
import {
  type Variants,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const TILT_SPRING = { stiffness: 260, damping: 28, mass: 0.6 };

const badgeVariants: Variants = {
  rest: { opacity: 0.85, y: 0, scale: 1 },
  hover: (i: number) => ({
    opacity: 1,
    y: -2,
    scale: 1.04,
    transition: { delay: i * 0.04, duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  }),
};

function GithubIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

type ProjectShowcaseCardProps = {
  project: Project;
  index: number;
};

export function ProjectShowcaseCard({
  project,
  index,
}: ProjectShowcaseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tiltEnabled, setTiltEnabled] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [7, -7]),
    TILT_SPRING,
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-7, 7]),
    TILT_SPRING,
  );
  const imageX = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-10, 10]),
    TILT_SPRING,
  );
  const imageY = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [-8, 8]),
    TILT_SPRING,
  );
  const scale = useSpring(isHovered && tiltEnabled ? 1.02 : 1, TILT_SPRING);

  useEffect(() => {
    setTiltEnabled(
      window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    );
  }, []);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!tiltEnabled || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
      pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [pointerX, pointerY, tiltEnabled],
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.55,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="[perspective:1200px]"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: tiltEnabled ? rotateX : 0,
          rotateY: tiltEnabled ? rotateY : 0,
          scale,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 shadow-sm backdrop-blur-sm transition-[box-shadow,border-color] duration-500 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)] dark:hover:border-zinc-700/90 dark:hover:shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <motion.div
            style={{
              x: tiltEnabled ? imageX : 0,
              y: tiltEnabled ? imageY : 0,
              scale: isHovered && tiltEnabled ? 1.06 : 1,
              willChange: 'transform',
            }}
            className="absolute inset-0"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent dark:from-zinc-950 dark:via-zinc-950/20" />
        </div>

        <div
          className="relative space-y-5 p-6 sm:p-8"
          style={{ transform: 'translateZ(24px)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="section-kicker">
                Project {String(index + 1).padStart(2, '0')}
              </p>
              <h2 className="text-primary text-2xl font-semibold tracking-tight sm:text-3xl">
                {project.title}
              </h2>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {project.github && (
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} on GitHub`}
                  className="text-icon flex size-10 items-center justify-center rounded-full border border-zinc-200 bg-white/80 backdrop-blur-sm transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
                >
                  <GithubIcon />
                </Link>
              )}
              <Link
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live site`}
                className="flex size-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-400 backdrop-blur-sm transition-colors hover:border-zinc-700 hover:text-zinc-100"
              >
                <GlobeIcon />
              </Link>
            </div>
          </div>

          <motion.div
            className="flex flex-wrap gap-2"
            initial="rest"
            animate={isHovered ? 'hover' : 'rest'}
          >
            {project.technologies.map((tech, i) => (
              <motion.span
                key={tech.name}
                custom={i}
                variants={badgeVariants}
                className="text-secondary rounded-full border border-zinc-200 bg-zinc-50/80 px-3 py-1 text-[12px] font-medium backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300"
              >
                {tech.name}
              </motion.span>
            ))}
          </motion.div>

          <p className="text-secondary max-w-2xl text-[15px] leading-relaxed sm:text-base">
            {project.description}
          </p>

          <Link
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link text-primary inline-flex items-center gap-2 text-[14px] font-medium transition-colors hover:text-zinc-600 dark:hover:text-white"
          >
            View Live Project
            <span className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
              <ArrowUpRightIcon />
            </span>
          </Link>
        </div>
      </motion.div>
    </motion.article>
  );
}
