import {
  CommandPaletteMobileSearchTrigger,
  CommandPaletteSearchTrigger,
} from '@/components/command-palette';
import { navbarConfig } from '@/config/Navbar';
import Link from 'next/link';

import { ThemeToggleButton } from './ThemeSwitch';

export default function Navbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[#ffffff] [mask-image:linear-gradient(to_bottom,black_82%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black_82%,transparent)] dark:bg-[#070709]"
      />
      <div className="relative mx-auto w-full max-w-3xl px-6 lg:px-0">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-5 md:gap-6">
            {navbarConfig.navItems.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                className={`relative text-sm transition-colors after:absolute after:-bottom-px after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:content-[''] md:hover:after:w-full ${
                  i === 0
                    ? 'text-[#111111] dark:text-[#e0e0e0]'
                    : 'text-[#555555] hover:text-[#111111] dark:text-[#a0a0a0] dark:hover:text-[#e0e0e0]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <CommandPaletteMobileSearchTrigger />
            <CommandPaletteSearchTrigger />
            <ThemeToggleButton variant="circle" start="top-right" blur />
          </div>
        </div>
      </div>
    </nav>
  );
}
