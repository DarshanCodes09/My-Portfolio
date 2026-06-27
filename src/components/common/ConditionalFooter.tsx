'use client';

import Footer from '@/components/common/Footer';
import { usePathname } from 'next/navigation';

const HIDDEN_FOOTER_PATHS = ['/blog'];

export default function ConditionalFooter() {
  const pathname = usePathname();

  if (HIDDEN_FOOTER_PATHS.includes(pathname)) {
    return null;
  }

  return <Footer />;
}
