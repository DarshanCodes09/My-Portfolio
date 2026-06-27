import React from 'react';

export default function Container({
  children,
  className,
  id,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`mx-auto w-full max-w-3xl px-6 lg:px-0 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}
