'use client';

import { useEffect, useState } from 'react';

type VisitorCounterProps = {
  variant?: 'ordinal' | 'hash';
  className?: string;
};

function formatOrdinal(n: number) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  return `${n.toLocaleString()}${suffix}`;
}

export default function VisitorCounter({
  variant = 'ordinal',
  className,
}: VisitorCounterProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/visitors')
      .then(async (res) => {
        const contentType = res.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) {
          throw new Error('Invalid visitor response');
        }
        return res.json() as Promise<{
          count?: number | null;
          available?: boolean;
        }>;
      })
      .then((data) => {
        if (
          data.available !== false &&
          typeof data.count === 'number' &&
          data.count > 0
        ) {
          setCount(data.count);
        }
      })
      .catch(() => setCount(null));
  }, []);

  if (count === null) return null;

  if (variant === 'hash') {
    return (
      <p className={className}>
        Visitors <span className="text-primary font-medium">#{count}</span>
      </p>
    );
  }

  return (
    <p
      className={className ?? 'text-muted shrink-0 text-[12px] sm:text-[13px]'}
    >
      You are the{' '}
      <span className="text-primary font-semibold">{formatOrdinal(count)}</span>{' '}
      visitor
    </p>
  );
}
