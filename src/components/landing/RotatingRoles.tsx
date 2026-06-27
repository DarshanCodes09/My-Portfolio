'use client';

import { siteConfig } from '@/config/Site';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function RotatingRoles() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % siteConfig.roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block min-w-[12rem] overflow-hidden text-sm font-medium text-zinc-500 sm:text-[15px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={siteConfig.roles[index]}
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {siteConfig.roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
