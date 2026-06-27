'use client';

import { techStack } from '@/config/TechStack';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import Container from '../common/Container';
import FadeIn from '../common/FadeIn';

function TechIcon({ name, icon, iconDark }: (typeof techStack)[number]) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src = mounted && resolvedTheme === 'dark' ? (iconDark ?? icon) : icon;

  return (
    <div
      className="group flex size-8 items-center justify-center rounded-md transition-transform duration-200 hover:scale-110 sm:size-9"
      title={name}
    >
      <Image
        src={src}
        alt={name}
        width={28}
        height={28}
        className="size-6 object-contain sm:size-7"
        unoptimized
      />
    </div>
  );
}

export default function TechStack() {
  return (
    <Container className="mt-16">
      <FadeIn>
        <div className="section-kicker mb-5">Tech Stack</div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {techStack.map((tech) => (
            <TechIcon key={tech.name} {...tech} />
          ))}
        </div>
      </FadeIn>
    </Container>
  );
}
