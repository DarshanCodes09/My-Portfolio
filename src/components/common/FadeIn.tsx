'use client';

import { type Variants, motion, useInView } from 'motion/react';
import { useRef } from 'react';

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
};

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export default function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.55,
  y = 20,
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-60px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y, filter: 'blur(8px)' }
      }
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={fadeVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
